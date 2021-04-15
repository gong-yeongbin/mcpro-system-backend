import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { SubMedia } from 'src/entities/SubMedia';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { Tracking } from 'src/entities/Tracking';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(SubMedia)
    private readonly submediaRepository: Repository<SubMedia>,
    @InjectRepository(Tracking)
    private readonly trackingRepository: Repository<Tracking>,
  ) {}
  async tracking(req: any) {
    //1. 로그 서버로 트래픽 전송
    //예외처리 : 메크로스pro 트래커 시  parameter 없이 보내는 경우
    if (!req.query.token || !req.query.click_id || !req.query.pub_id) {
      throw new NotFoundException();
    }

    //2. 캠페인 토큰 검증 (캠페인 및 광고앱 차단 여부 확인)
    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: {
        token: req.query.token,
        status: true,
      },
      relations: ['advertising', 'advertising.tracker', 'advertising.media'],
    });

    if (!campaignEntity) {
      throw new NotFoundException();
    }

    //3. 노출용코드 관련
    let submediaCode: string;
    if (!req.query.sub_id || req.query.sub_id === '{sub_id}') {
      submediaCode = req.query.pub_id;
    } else {
      submediaCode = req.query.pub_id + '_||_' + req.query.sub_id;
    }

    const mediaCode = campaignEntity.media.code;
    const campaignCode = campaignEntity.code;
    const trackerCode = campaignEntity.advertising.tracker.code;
    const advertisingCode = campaignEntity.advertising.code;

    const submediaEntity: SubMedia = await this.submediaRepository.findOne({
      where: {
        submediaCode: submediaCode,
      },
    });

    //새로운 노출용코드 생성
    const viewCode = v4().replace('-', '');

    //기존 노출용코드 반환
    if (!submediaEntity) {
      //캐시 메모리 처리(v2)
      const submedia: SubMedia = new SubMedia();
      submedia.mediaCode = mediaCode;
      submedia.campaignToken = req.query.token;
      submedia.viewCode = viewCode;
      submedia.submediaCode = submediaCode;
      submedia.trackerCode = trackerCode;
      submedia.campaignCode = campaignCode;
      submedia.registeredAt = new Date(moment().format('YYYY-MM-DD 00:00:00'));

      await this.submediaRepository.save(submedia);
    } else {
      throw new NotFoundException();
    }

    //4. 메크로스Pro 트래킹 URL 를 트래커 트래킹 URL 변환
    const convertedTrackingUrl = await convertTrackerTracking(
      trackerCode,
      campaignEntity.trackerTrackingUrl,
      req.query,
      viewCode,
    );

    //5. 트래커 트래킹 URL를 실행
    if (convertedTrackingUrl !== false) {
      // res.statusCode = 302;
      // res.setHeader("Location", convertedTrackingUrl);
      res.redirect(convertedTrackingUrl);
      res.end();
    }

    //6. 트래킹 로그 확인
    //6-1) 메크로스 트래킹 로그 확인
    if (campaignEntity.mecrossTrackingStatus) {
      const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

      const tracking: Tracking = new Tracking();
      tracking.type = 'mecross';
      tracking.advertisingCode = advertisingCode;
      tracking.campaignCode = campaignCode;
      tracking.mediaCode = mediaCode;
      tracking.trackerCode = trackerCode;
      tracking.trackingUrl = fullUrl;

      await this.trackingRepository.save(tracking);

      //한 개 저장된 경우 off 로 변환
      const campaignEntity: Campaign = await this.campaignRepository.findOne({
        where: { token: req.query.token },
      });
      campaignEntity.mecrossTrackingStatus = false;
      await this.campaignRepository.save(campaignEntity);
    }

    //6-2) 트래커 트래킹 로그 확인
    if (campaignEntity.trackerTrackingStatus) {
      const tracking: Tracking = new Tracking();
      tracking.type = 'tracker';
      tracking.advertisingCode = advertisingCode;
      tracking.campaignCode = campaignCode;
      tracking.mediaCode = mediaCode;
      tracking.trackerCode = trackerCode;
      tracking.trackingUrl = convertedTrackingUrl;
      await this.trackingRepository.save(tracking);

      //한 개 저장된 경우 off 로 변환
      const campaignEntity: Campaign = await this.campaignRepository.findOne({
        where: { token: req.query.token },
      });
      campaignEntity.trackerTrackingStatus = false;
      await this.campaignRepository.save(campaignEntity);
    }

    //7. 클릭 데이터 취합
    try {
      await query.dailyCollection(
        'click',
        advertisingCode,
        campaignCode,
        req.query.token,
        trackerCode,
        mediaCode,
        submediaCode,
        viewCode,
      );
    } catch (err) {
      console.log('클릭 데이터 취합 error : ' + err);
    }

    return;
  }
}
