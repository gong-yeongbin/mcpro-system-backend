import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { SubMedia } from 'src/entities/SubMedia';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { TrackingDto } from './dto/tracking.dto';
import { convertTrackerTrackingUrl } from '../common/util';
import { CampaignDaily } from 'src/entities/CampaignDaily';
import * as moment from 'moment';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(SubMedia)
    private readonly submediaRepository: Repository<SubMedia>,
    @InjectRepository(CampaignDaily)
    private readonly campaignDailyRepository: Repository<CampaignDaily>,
  ) {}

  async tracking(requestQuery: TrackingDto): Promise<string> {
    Logger.log(`[media -> mecrosspro] : ${JSON.stringify(requestQuery)}`);

    //2. 캠페인 토큰 검증 (캠페인 및 광고앱 차단 여부 확인)
    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: {
        cpToken: requestQuery.token,
        cpStatus: true,
      },
      relations: ['media', 'advertising', 'advertising.tracker'],
    });

    if (!campaignEntity) {
      throw new NotFoundException();
    }

    //3. 노출용코드 관련
    const pubId: string = requestQuery.pub_id;
    const subId: string =
      requestQuery.sub_id == '' ||
      requestQuery.sub_id == undefined ||
      requestQuery.sub_id == '{sub_id}'
        ? ''
        : requestQuery.sub_id;

    const submediaEntity: SubMedia = await this.submediaRepository.findOne({
      where: {
        pubId: pubId,
        subId: subId,
      },
      relations: ['advertising', 'media', 'advertising.tracker'],
    });

    //새로운 노출용코드 생성
    const viewCode = v4().replace(/-/g, '');

    //기존 노출용코드 반환
    if (!submediaEntity) {
      const submedia: SubMedia = new SubMedia();
      submedia.media = campaignEntity.media;
      submedia.cpToken = requestQuery.token;
      submedia.viewCode = viewCode;
      submedia.pubId = pubId;
      submedia.subId = subId;
      submedia.campaign = campaignEntity;
      submedia.advertising = campaignEntity.advertising;

      await this.submediaRepository.save(submedia);
    }

    // //4. 메크로스Pro 트래킹 URL 를 트래커 트래킹 URL 변환
    const convertedTrackingUrl: string = convertTrackerTrackingUrl(
      campaignEntity.advertising.tracker.tkCode,
      campaignEntity.trackerTrackingUrl,
      requestQuery,
      viewCode,
    );

    //5. 트래커 트래킹 URL를 실행
    if (convertedTrackingUrl !== null) {
      const submediaEntity: SubMedia = await this.submediaRepository.findOne({
        where: {
          pubId: pubId,
          subId: subId,
        },
      });

      const campaignDailyEntity: CampaignDaily = await this.campaignDailyRepository.findOne(
        {
          where: {
            campaign: campaignEntity,
            subMedia: submediaEntity,
            createdAt: moment().format('YYYY-MM-DD'),
          },
        },
      );
      if (!campaignDailyEntity) {
        const campaignDaily: CampaignDaily = new CampaignDaily();

        campaignDaily.viewCode = submediaEntity.viewCode;
        campaignDaily.click = 1;
        campaignDaily.tracker = campaignEntity.advertising.tracker;
        campaignDaily.media = campaignEntity.media;
        campaignDaily.advertising = campaignEntity.advertising;
        campaignDaily.campaign = campaignEntity;
        campaignDaily.subMedia = submediaEntity;
        campaignDaily.createdAt = new Date();
        campaignDaily.updatedAt = new Date();

        await this.campaignDailyRepository.save(campaignDaily);
      } else {
        campaignDailyEntity.click = Number(campaignDailyEntity.click) + 1;

        await this.campaignDailyRepository.save(campaignDailyEntity);
      }

      return convertedTrackingUrl;
    }
  }
}
