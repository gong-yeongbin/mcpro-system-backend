import {
  HttpService,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubMedia } from 'src/entities/SubMedia';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { PostbackInstallDto } from './dto/postback-install.dto';
import { postBackInstall } from 'src/common/util';
import { PostBackLog } from 'src/entities/PostBackLog';
import { CampaignDaily } from 'src/entities/CampaignDaily';

@Injectable()
export class PostbackService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(SubMedia)
    private readonly subMediaRepository: Repository<SubMedia>,
    @InjectRepository(PostBackLog)
    private readonly postBackLogRepository: Repository<PostBackLog>,
    @InjectRepository(CampaignDaily)
    private readonly campaignDailyRepository: Repository<CampaignDaily>,
  ) {}

  async postBackInstall(req: any, query: PostbackInstallDto) {
    const originalUrl: string = `${req.protocol}://${req.get('host')}${
      req.originalUrl
    }` as string;
    //1. 로그서버로 트래픽 전송
    //2. 트래커 별 포스트백 공통 (viewCode, adid, clickid ...)

    const {
      tkCode,
      viewCode,
      clickId,
      deviceId,
      deviceAndroidId,
      deviceIosId,
      deviceCarrier,
      deviceCountry,
      deviceLanguage,
      deviceIp,
      appkey,
      clickDatetime,
      installDatetime,
    } = postBackInstall(query);

    //3. 노출용코드(viewCode)로 캠페인토큰, 광고앱코드, 캠페인코드, 매체코드, 서브매체코드 가져오기
    //viewCode는 모든 트래커가 공통으로 내려주는 컬럼 (campaignToken 은 공통 x)
    if (!viewCode) {
      throw new InternalServerErrorException();
    }

    //4. 캠페인(Campaign) 관련 정보 가져오기
    //4-1) 포스트백 별 매체 전송 여부 (Postback)
    //4-2) 매체 별 포스트백 URL 템플릿 (Media)
    //4-3) 광고앱 차단 여부 (Advertising)
    //* 광고앱이 off 인 경우 포스트백을 받지 않는다.
    //캐시 메모리 처리(v1)
    const subMediaEntity: SubMedia = await this.subMediaRepository
      .createQueryBuilder('subMedia')
      .leftJoinAndSelect('subMedia.advertising', 'advertising')
      .leftJoinAndSelect('subMedia.campaign', 'campaign')
      .leftJoinAndSelect('subMedia.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .where('postBackEvent.trackerPostBack =:trackerPostBack', {
        trackerPostBack: 'install',
      })
      .andWhere('advertising.adStatus =:adStatus', { adStatus: true })
      .getOne();

    if (!subMediaEntity) {
      throw new NotFoundException();
    }

    //캐시 메모리 처리(v2)
    const { advertising, campaign, media } = subMediaEntity;

    //5. 트래커의 인스톨 포스트백 DB 저장
    const postBackLog: PostBackLog = new PostBackLog();
    postBackLog.campaignToken = subMediaEntity.cpToken;
    postBackLog.viewCode = viewCode;
    postBackLog.type = campaign.type;
    postBackLog.platform = advertising.adPlatform;
    postBackLog.appkey = appkey;
    postBackLog.deviceCountry = deviceCountry;
    postBackLog.deviceLanguage = deviceLanguage;
    postBackLog.deviceCarrier = deviceCarrier;
    postBackLog.deviceIp = deviceIp;
    postBackLog.deviceId = deviceId;
    postBackLog.clickId = clickId;
    postBackLog.deviceAndroidId = deviceAndroidId;
    postBackLog.deviceIosId = deviceIosId;
    postBackLog.clickDatetime = new Date(clickDatetime);
    postBackLog.installDatetime = new Date(installDatetime);
    postBackLog.eventName = 'install';
    postBackLog.media = media;
    postBackLog.advertising = advertising;
    postBackLog.campaign = campaign;
    postBackLog.subMedia = subMediaEntity;
    postBackLog.originalUrl = originalUrl;
    postBackLog.tracker = advertising.tracker;

    const postBackLogEntity: PostBackLog = await this.postBackLogRepository.save(
      postBackLog,
    );

    //6. 매체 전송 인 경우 매체 전송 후 포스트백 테이블에 기록
    //6-1) 포스트백 별 매체 전송 여부 (Postback)
    //6-2) 매체 별 포스트백 URL 템플릿 (Media)
    //media 테이블의 postback_install_url_template 컬럼에서 가져오기
    /**
     * 애드마일 install 포스트백 : http://admile.offerstrack.net/advBack.php?click_id={click_id}&adv_id=641
     * 패들웨이버 install 포스트백 : http://postback.paddlewaver.com/?adv=1000137&clickid={click_id}&payout={payout}
     * 아바주 install 포스트백 : http://postback.apx.avazutracking.net/postback.php?advid=24571&subid={click_id}&install_timestamp={install_timestamp}&adid={device_id}&siteid=
     * 애드타이밍 install 포스트백 : http://api.adtiming.com/callback/active?n=701&c={click_id}&idfa={ios_device_id}&gaid={android_device_id}
     */
    //캠페인 off 인 경우 매체 전송하지 않는다.
    if (campaign.cpStatus) {
      const convertedPostbackInstallUrlTemplate = media.mediaPostbackInstallUrlTemplate
        .replace('{click_id}', clickId)
        .replace('{device_id}', deviceId)
        .replace('{android_device_id}', deviceAndroidId)
        .replace('{ios_device_id}', deviceIosId)
        .replace('{install_timestamp}', installDatetime);
      if (
        campaign &&
        campaign.postBackEvent &&
        campaign.postBackEvent[0].sendPostback === true
      ) {
        postBackLogEntity.mediaSendUrl = convertedPostbackInstallUrlTemplate;

        await this.httpService
          .get('http://naver1.com')
          .toPromise()
          .then(() => {
            postBackLogEntity.mediaSendDatetime = new Date();
          })
          .catch();

        await this.postBackLogRepository.save(postBackLogEntity);
      }
    }

    const campaignDailyEntity: CampaignDaily = await this.campaignDailyRepository.findOne(
      {
        where: { createdAt: moment().format('YYYY-MM-DD') },
        relations: ['campaign', 'subMedia'],
      },
    );

    if (!campaignDailyEntity) {
      throw new NotFoundException();
    }

    campaignDailyEntity.install = Number(campaignDailyEntity.install) + 1;
    await this.campaignDailyRepository.save(campaignDailyEntity);

    return;
  }
}
