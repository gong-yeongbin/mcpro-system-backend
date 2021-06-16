import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import {
  PostBackDaily,
  PostBackDailyMetaData,
} from 'src/entities/PostBackDaily';
import { getConnection, getManager, Repository } from 'typeorm';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { RedisService } from 'nestjs-redis';
import { RedisLockService } from 'nestjs-simple-redis-lock';
import { decodeUnicode } from 'src/common/util';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostBackDaily)
    private readonly postBackDailyRepository: Repository<PostBackDaily>,
    private readonly redisService: RedisService,
    private readonly lockService: RedisLockService,
  ) {}

  async tracking(request: any): Promise<string> {
    const originalUrl: string = decodeUnicode(
      `${request.protocol}://${request.get('host')}${request.originalUrl}`,
    );

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

    console.log(`[ media ---> mecrosspro ] ${originalUrl}`);

    //2. 캠페인 토큰 검증 (캠페인 및 광고앱 차단 여부 확인)
    const campaign: Campaign = await this.campaignRepository.findOne({
      where: {
        cp_token: cp_token,
        status: true,
      },
      relations: ['media', 'advertising', 'advertising.tracker'],
    });

    if (!campaign) throw new NotFoundException();

    const { media, advertising } = campaign;
    const { tracker } = advertising;

    //새로운 노출용코드 생성
    let view_code: string;

    await getConnection().transaction(async (transactionManager) => {
      const postBackDailyEntity = await transactionManager
        .getRepository(PostBackDaily)
        .createQueryBuilder('postBackDaily')
        .leftJoinAndSelect('postBackDaily.campaign', 'campaign')
        .leftJoinAndSelect('campaign.media', 'media')
        .where('postBackDaily.pub_id =:pub_id', { pub_id: pub_id })
        .andWhere('postBackDaily.sub_id =:sub_id', { sub_id: sub_id })
        .andWhere('postBackDaily.cp_token =:cp_token', {
          cp_token: campaign.cp_token,
        })
        .andWhere('media =:mediaIdx', { mediaIdx: media.idx })
        .andWhere('Date(postBackDaily.created_at) =:date ', {
          date: moment().format('YYYY-MM-DD'),
        })
        .getOne();

      //기존 노출용코드 반환
      if (!postBackDailyEntity) {
        view_code = v4().replace(/-/g, '');

        const postBackDaily: PostBackDaily = new PostBackDaily();
        postBackDaily.cp_token = cp_token;
        postBackDaily.view_code = view_code;
        postBackDaily.pub_id = pub_id;
        postBackDaily.sub_id = sub_id;
        postBackDaily.campaign = campaign;
        postBackDaily.click = +postBackDaily.click + 1;
        // const postBackDailyMetaData: PostBackDailyMetaData = {
        //   cp_token,
        //   view_code,
        //   pub_id,
        //   sub_id,
        //   campaign,
        // };

        await transactionManager
          .getRepository(PostBackDaily)
          .save(postBackDailyEntity);
      } else {
        view_code = postBackDailyEntity.view_code;
        postBackDailyEntity.click = +postBackDailyEntity.click + 1;
        this.postBackDailyRepository.save(postBackDailyEntity);
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
    // if (convertedTrackingUrl !== null) {
    //   try {
    //     await this.lockService.lock(
    //       moment().format('YYYYMMDD'),
    //       2 * 60 * 1000,
    //       50,
    //       50,
    //     );
    //     const isExists: number = await this.redisService
    //       .getClient()
    //       .hsetnx(
    //         moment().format('YYYYMMDD'),
    //         `${cp_token}/${view_code}/${pub_id}/${sub_id}`,
    //         1,
    //       );

    //     if (!isExists) {
    //       await this.redisService
    //         .getClient()
    //         .hincrby(
    //           moment().format('YYYYMMDD'),
    //           `${cp_token}/${view_code}/${pub_id}/${sub_id}`,
    //           1,
    //         );
    //     }
    //   } finally {
    //     this.lockService.unlock(moment().format('YYYYMMDD'));
    //   }
    return convertedTrackingUrl;
    // }
  }
}

function convertTrackerTrackingUrl(
  tk_code: string,
  trackerTrackingUrl: string,
  query: any,
  view_code: string,
) {
  const android_device_id = query.adid === '{adid}' ? '' : query.adid;
  const ios_device_id = query.idfa === '{idfa}' ? '' : query.idfa;
  const device_id: string = android_device_id
    ? android_device_id
    : ios_device_id;

  let convertedTrackerTrackingUrl: string = null;

  switch (tk_code) {
    case 'appsflyer':
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace(
          '{clickid}', //click id
          query.click_id,
        )
        .replace(
          '{af_siteid}', //view code
          view_code,
        )
        .replace(
          '{af_c_id}', //campaign token
          query.token,
        )
        .replace(
          '{advertising_id}', //android device id
          android_device_id,
        )
        .replace(
          '{idfa}', //ios device id
          ios_device_id,
        )
        .replace('{af_adset_id}', '')
        .replace('{af_ad_id}', '')
        .replace('{af_ip}', '') //device ip
        .replace('{af_ua}', '') //user agent
        .replace('{af_lang}', ''); //device language
      break;
    case 'adbrix':
      break;
    case 'adbrix_remaster':
      break;
    case 'mobiconnect':
      break;
    case 'airbridge':
      break;
  }

  return convertedTrackerTrackingUrl;
}
