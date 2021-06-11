import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { SubMedia, SubMediaMetaData } from 'src/entities/SubMedia';
import { getConnection, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { convertTrackerTrackingUrl } from '../common/util';
import * as moment from 'moment';
import { RedisService } from 'nestjs-redis';
import { RedisLockService } from 'nestjs-simple-redis-lock';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    private readonly redisService: RedisService,
    private readonly lockService: RedisLockService,
  ) {}
  async tracking(request: any): Promise<string> {
    const cp_token: string = ['', undefined, '{token}'].includes(
      request.query.token,
    )
      ? ''
      : request.query.token;
    const pub_id: string = ['', undefined, '{pub_id}'].includes(
      request.query.pub_id,
    )
      ? ''
      : request.query.pub_id;
    const click_id: string = ['', undefined, '{click_id}'].includes(
      request.query.click_id,
    )
      ? ''
      : request.query.click_id;
    const sub_id: string = ['', undefined, '{sub_id}'].includes(
      request.query.sub_id,
    )
      ? ''
      : request.query.sub_id;
    const adid: string = ['', undefined, '{adid}'].includes(request.query.adid)
      ? ''
      : request.query.adid;
    const idfa: string = ['', undefined, '{idfa}'].includes(request.query.idfa)
      ? ''
      : request.query.idfa;

    console.log(
      `[ media ---> mecrosspro ] token: ${cp_token}, click_id: ${click_id}, pub_id: ${pub_id}, sub_id: ${sub_id}, adid: ${adid}, idfa: ${idfa} `,
    );

    //2. 캠페인 토큰 검증 (캠페인 및 광고앱 차단 여부 확인)
    const campaign: Campaign = await this.campaignRepository.findOne({
      where: {
        cp_token: cp_token,
        cp_status: true,
      },
      relations: ['media', 'advertising', 'advertising.tracker'],
    });

    if (!campaign) throw new NotFoundException();

    const { media, advertising } = campaign;
    const { tracker } = advertising;

    //새로운 노출용코드 생성
    let view_code: string;

    await getConnection().transaction(async (transactionManager) => {
      const subMedia = await transactionManager
        .getRepository(SubMedia)
        .createQueryBuilder('subMedia')
        .where('subMedia.pub_id =:pub_id', { pub_id: pub_id })
        .andWhere('subMedia.sub_id =:sub_id', { sub_id: sub_id })
        .andWhere('subMedia.campaign =:campaignIdx', {
          campaignIdx: campaign.idx,
        })
        .andWhere('Date(subMedia.created_at) =:date ', {
          date: moment().format('YYYY-MM-DD'),
        })
        .getOne();

      //기존 노출용코드 반환
      if (!subMedia) {
        view_code = v4().replace(/-/g, '');

        const subMediaMetaData: SubMediaMetaData = {
          media,
          cp_token,
          view_code,
          pub_id,
          sub_id,
          campaign,
          advertising,
        };

        await transactionManager.getRepository(SubMedia).save(subMediaMetaData);
      } else {
        view_code = subMedia.view_code;
      }
    });

    //4. 메크로스Pro 트래킹 URL 를 트래커 트래킹 URL 변환
    const convertedTrackingUrl: string = convertTrackerTrackingUrl(
      tracker.tk_code,
      campaign.trackerTrackingUrl,
      request.query,
      view_code,
    );

    //5. 트래커 트래킹 URL를 실행
    if (convertedTrackingUrl !== null) {
      try {
        await this.lockService.lock(
          moment().format('YYYYMMDD'),
          2 * 60 * 1000,
          50,
          50,
        );
        const isExists: number = await this.redisService
          .getClient()
          .hsetnx(
            moment().format('YYYYMMDD'),
            `${cp_token}/${view_code}/${pub_id}/${sub_id}`,
            1,
          );

        if (!isExists) {
          await this.redisService
            .getClient()
            .hincrby(
              moment().format('YYYYMMDD'),
              `${cp_token}/${view_code}/${pub_id}/${sub_id}`,
              1,
            );
        }
      } finally {
        this.lockService.unlock(moment().format('YYYYMMDD'));
      }
      return convertedTrackingUrl;
    }
  }
}
