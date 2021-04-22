import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { SubMedia } from 'src/entities/SubMedia';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { TrackingDto } from './dto/tracking.dto';
import { convertTrackerTrackingUrl } from '../common/util';

@Injectable()
export class TrackingService {
  // constructor() // private readonly campaignRepository: Repository<Campaign>, // @InjectRepository(Campaign)
  // // @InjectRepository(SubMedia)
  // // private readonly submediaRepository: Repository<SubMedia>,
  // {}

  async tracking(requestQuery: TrackingDto): Promise<string> {
    console.log(
      'cloudwatch log test!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
    );
    // //2. 캠페인 토큰 검증 (캠페인 및 광고앱 차단 여부 확인)
    // const campaignEntity: Campaign = await this.campaignRepository.findOne({
    //   where: {
    //     cpToken: requestQuery.token,
    //     cpStatus: true,
    //   },
    //   relations: ['media', 'advertising', 'advertising.tracker'],
    // });

    // if (!campaignEntity) {
    //   throw new NotFoundException();
    // }

    // //3. 노출용코드 관련
    // const pubId: string = requestQuery.pub_id;
    // const subId: string =
    //   requestQuery.sub_id == '' ||
    //   requestQuery.sub_id == undefined ||
    //   requestQuery.sub_id == '{sub_id}'
    //     ? ''
    //     : requestQuery.sub_id;

    // const submediaEntity: SubMedia = await this.submediaRepository.findOne({
    //   where: {
    //     pubId: pubId,
    //     subId: subId,
    //   },
    //   relations: ['advertising', 'media', 'advertising.tracker'],
    // });

    // //새로운 노출용코드 생성
    // const viewCode = v4().replace(/-/g, '');

    // //기존 노출용코드 반환
    // if (!submediaEntity) {
    //   //캐시 메모리 처리(v2)
    //   const submedia: SubMedia = new SubMedia();
    //   submedia.media = campaignEntity.media;
    //   submedia.cpToken = requestQuery.token;
    //   submedia.viewCode = viewCode;
    //   submedia.pubId = pubId;
    //   submedia.subId = subId;
    //   submedia.campaign = campaignEntity;
    //   submedia.advertising = campaignEntity.advertising;

    //   await this.submediaRepository.save(submedia);
    // }

    // // //4. 메크로스Pro 트래킹 URL 를 트래커 트래킹 URL 변환
    // const convertedTrackingUrl: string = convertTrackerTrackingUrl(
    //   campaignEntity.advertising.tracker.tkCode,
    //   campaignEntity.trackerTrackingUrl,
    //   requestQuery,
    //   viewCode,
    // );

    // //5. 트래커 트래킹 URL를 실행
    // if (convertedTrackingUrl !== null) {
    //   return convertedTrackingUrl;
    // }

    // //6. 트래킹 로그 확인
    // //6-1) 메크로스 트래킹 로그 확인

    // //7. 클릭 데이터 취합
    // try {
    //   await query.dailyCollection(
    //     'click',
    //     advertisingCode,
    //     campaignCode,
    //     req.query.token,
    //     trackerCode,
    //     mediaCode,
    //     submediaCode,
    //     viewCode,
    //   );
    // } catch (err) {
    //   console.log('클릭 데이터 취합 error : ' + err);
    // }

    // let exist = await sequelize.query(
    //   `select * from ${tableNameForCampaignSubmedia} where campaignCode = '${campaignCode}' and submediaCode = '${submediaCode}' and registeredAt = '${currentDay}' limit 1;`,
    //   {
    //     type: QueryTypes.SELECT,
    //   },
    // );

    return;
  }
}
