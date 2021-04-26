import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { SubMedia } from 'src/entities/SubMedia';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { PostbackInstallDto } from './dto/postback-install.dto';
import { postBackInstall } from 'src/common/util';

@Injectable()
export class PostbackService {
  constructor(
    @InjectRepository(SubMedia)
    private readonly subMediaRepository: Repository<SubMedia>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async postBackInstall(req: PostbackInstallDto, res: any) {
    //1. 로그서버로 트래픽 전송

    //2. 트래커 별 포스트백 공통 (viewCode, adid, clickid ...)

    //3. 노출용코드(viewCode)로 캠페인토큰, 광고앱코드, 캠페인코드, 매체코드, 서브매체코드 가져오기
    //viewCode는 모든 트래커가 공통으로 내려주는 컬럼 (campaignToken 은 공통 x)
    // if (!viewCode) {
    //   return res.status(500).send('incorrect parameter error!');
    // }

    const subMediaEntity: SubMedia = await this.subMediaRepository.findOne({
      where: { viewCode: '' },
    });

    //캐시 메모리 처리(v2)
    const {
      cpToken,
      advertising,
      campaign,
      media,
      pubId,
      subId,
    } = subMediaEntity;

    if (!cpToken) {
      return res.status(500).send('incorrect viewcode error!');
    }

    //4. 캠페인(Campaign) 관련 정보 가져오기
    //4-1) 포스트백 별 매체 전송 여부 (Postback)
    //4-2) 매체 별 포스트백 URL 템플릿 (Media)
    //4-3) 광고앱 차단 여부 (Advertising)
    //* 광고앱이 off 인 경우 포스트백을 받지 않는다.
    //캐시 메모리 처리(v1)
    const campaingEntity: Campaign = await this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .leftJoinAndSelect('campaign.media', 'media')
      .leftJoinAndSelect('campaign.advertising', 'advertising')
      .where('campaign.cpToken =:cpToken', { cpToken: cpToken })
      .andWhere('postBackEvent.trackerPostback =:trackerPostback', {
        trackerPostback: 'install',
      })
      .andWhere('advertising.adStatus =:adStatus', { adStatus: true })
      .getOne();

    //4-3) 광고앱 차단 여부
    if (!campaingEntity) {
      return res.status(500).send('Advertising Off!');
    }

    //5. 트래커의 인스톨 포스트백 DB 저장
    // const tableName = 'x_postback_' + advertisingCode;
    // let campaignInstallPostbackId = null;
    // try {
    //   campaignInstallPostbackId = await query.postbackInsertion(
    //     tableName,
    //     'install',
    //     trackerCode,
    //     mediaCode,
    //     advertisingCode,
    //     campaignCode,
    //     campaignToken,
    //     viewCode,
    //     url,
    //     clickDatetime,
    //     installDatetime,
    //     deviceId,
    //     clickId,
    //     submediaCode,
    //     deviceAndroidId,
    //     deviceIosId,
    //     deviceCarrier,
    //     deviceCountry,
    //     deviceLanguage,
    //     deviceIp,
    //     appkey,
    //     campaign.Advertising.platform,
    //     campaign.type,
    //   );
    //   res.status(200).send('Postback Succeed!');
    // } catch (err) {
    //   console.log(
    //     `[포스트백] [tracker -> mecrosspro] [${trackerCode}] [${campaignCode}] [${mediaCode}] 트래커의 install 포스트백 DB 저장 에러 ` +
    //       err,
    //   );
    // }

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

    // if (campaingEntity.cpStatus) {
    //   const convertedPostbackInstallUrlTemplate = campaign.media.mediaPostbackInstallUrlTemplate
    //     .replace('{click_id}', clickId)
    //     .replace('{device_id}', deviceId)
    //     .replace('{android_device_id}', deviceAndroidId)
    //     .replace('{ios_device_id}', deviceIosId)
    //     .replace('{install_timestamp}', moment(installDatetime).unix());

    //   await mediaSendAndRecord(
    //     campaingEntity,
    //     tableName,
    //     campaignInstallPostbackId,
    //     convertedPostbackInstallUrlTemplate,
    //   );

    //   if (
    //     campaingEntity &&
    //     campaingEntity.Postbacks &&
    //     campaingEntity.Postbacks[0] &&
    //     campaingEntity.Postbacks[0].sendPostback === 'on'
    //   ) {
    //     let resMedia = null;
    //     try {
    //       console.log(convertedPostbackUrlTemplate);
    //       //매체 전송
    //       resMedia = await axios.get(convertedPostbackUrlTemplate);
    //     } catch (err) {
    //       console.log(`포스트백 매체 전송 에러 ` + err);
    //       await query.postbackRecordForMediaSend(
    //         tableName,
    //         convertedPostbackUrlTemplate,
    //         campaignPostbackId,
    //         'error',
    //       );
    //     }
    //     if (resMedia && resMedia.status === 200) {
    //       //매체 전송 후 포스트백 테이블에 기록
    //       try {
    //         await query.postbackRecordForMediaSend(
    //           tableName,
    //           convertedPostbackUrlTemplate,
    //           campaignPostbackId,
    //         );
    //       } catch (err) {
    //         console.log(`매체 전송 후 포스트백 테이블에 기록 에러 ` + err);
    //       }
    //     }
    //   }
    // }

    //7. 인스톨 데이터 취합
    // try {
    //   await query.dailyCollection(
    //     'install',
    //     advertisingCode,
    //     campaignCode,
    //     campaignToken,
    //     trackerCode,
    //     mediaCode,
    //     submediaCode,
    //     viewCode,
    //   );
    // } catch (err) {
    //   console.log(
    //     `[포스트백] [mecrosspro -> media] [${tableName}] [${mediaCode}] [${campaignCode}] install 포스트백 데이터 취합 에러 ` +
    //       err,
    //   );
    // }
    return;
  }
}
