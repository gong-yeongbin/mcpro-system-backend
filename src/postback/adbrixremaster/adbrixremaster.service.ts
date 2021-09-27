import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { PostbackInstallAdbrixremaster, PostbackEventAdbrixremaster, PostbackDaily, Campaign, PostbackRegisteredEvent } from '../../entities/Entity';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AdbrixremasterService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostbackRegisteredEvent)
    private readonly postbackEventRepository: Repository<PostbackRegisteredEvent>,
    @InjectRepository(PostbackInstallAdbrixremaster)
    private readonly postbackInstallAdbrixremasterRepository: Repository<PostbackInstallAdbrixremaster>,
    @InjectRepository(PostbackEventAdbrixremaster)
    private readonly postbackEventAdbrixremasterRepository: Repository<PostbackEventAdbrixremaster>,
  ) {}

  async postbackInstallAdbrixRemaster(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] install : ${originalUrl}`);

    const uuid: string = ['', undefined, '{uuid}'].includes(request.query.uuid) ? '' : request.query.uuid;

    const postbackInstallAdbrixremaster: PostbackInstallAdbrixremaster = this.postbackInstallAdbrixremasterRepository.create({
      viewCode: request.query.cb_2,
      token: request.query.cb_1,
      aKey: request.query.a_key,
      aCookie: request.query.a_cookie,
      aIp: request.query.a_ip,
      aFp: request.query.a_fp,
      aCountry: request.query.a_country,
      aCity: request.query.a_city,
      aRegion: request.query.a_region,
      aAppkey: request.query.a_appkey,
      mPublisher: request.query.m_publisher,
      mSubPublisher: request.query.m_sub_publisher,
      adid: request.query.adid,
      idfv: request.query.idfv,
      adIdOptOut: request.query.ad_id_opt_out,
      deviceOsVersion: request.query.device_os_version,
      deviceModel: request.query.device_model,
      deviceVendor: request.query.device_vendor,
      deviceResolution: request.query.device_resolution,
      devicePortrait: request.query.device_portrait,
      devicePlatform: request.query.device_platform,
      deviceNetwork: request.query.device_network,
      deviceWifi: request.query.device_wifi,
      deviceCarrier: request.query.device_carrier,
      deviceLanguage: request.query.device_language,
      deviceCountry: request.query.device_country,
      deviceBuildId: request.query.device_build_id,
      packageName: request.query.package_name,
      appkey: request.query.appkey,
      sdkVersion: request.query.sdk_version,
      installer: request.query.installer,
      appVersion: request.query.app_version,
      attrType: request.query.attr_type,
      eventName: request.query.event_name,
      eventDatetime: moment.utc(request.query.event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      deeplinkPath: request.query.deeplink_path,
      marketInstallBtnClicked: request.query.market_install_btn_clicked,
      appInstallStart: request.query.app_install_start,
      appInstallCompleted: request.query.app_install_completed,
      appFirstOpen: request.query.app_first_open,
      secondsGap: request.query.seconds_gap,
      cb_1: request.query.cb_1,
      cb_2: request.query.cb_2,
      cb_3: request.query.cb_3,
      cb_4: request.query.cb_4,
      cb_5: request.query.cb_5,
      originalUrl: originalUrl,
      aServerDatetime: moment.utc(request.query.a_server_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
    });

    const isValidationPostback: PostbackInstallAdbrixremaster = await this.postbackInstallAdbrixremasterRepository
      .createQueryBuilder('postbackInstallAdbrixremaster')
      .where('Date(postbackInstallAdbrixremaster.createdAt) =:date', { date: moment().tz('Asia/Seoul').format('YYYY-MM-DD') })
      .andWhere('postbackInstallAdbrixremaster.adid =:adid', { adid: postbackInstallAdbrixremaster.adid })
      .andWhere('postbackInstallAdbrixremaster.idfv =:idfv', { idfv: postbackInstallAdbrixremaster.idfv })
      .getOne();

    if (isValidationPostback) return;

    const token: string = postbackInstallAdbrixremaster.token;
    const viewCode: string = postbackInstallAdbrixremaster.viewCode;

    const postbackDailyEntity: PostbackDaily = await this.commonService.isValidationPostbackDaily(viewCode, token);

    if (!postbackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { token: token },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postbackEventEntity: PostbackRegisteredEvent = await this.postbackEventRepository.findOne({
      where: { token: token, tracker: 'install' },
    });

    if (postbackEventEntity.status) {
      const url: string = await this.commonService.convertedPostbackInstallUrl({
        uuid: uuid,
        click_id: postbackInstallAdbrixremaster.cb_3,
        adid: postbackInstallAdbrixremaster.adid,
        event_datetime: postbackInstallAdbrixremaster.eventDatetime,
        click_datetime: postbackInstallAdbrixremaster.aServerDatetime,
        campaignEntity: campaignEntity,
        postbackDailyEntity: postbackDailyEntity,
      });

      postbackInstallAdbrixremaster.sendTime = await this.commonService.httpServiceHandler(url);
      postbackInstallAdbrixremaster.sendUrl = url;
    }

    postbackInstallAdbrixremaster.pubId = postbackDailyEntity.pubId;
    postbackInstallAdbrixremaster.subId = postbackDailyEntity.subId;
    postbackInstallAdbrixremaster.media = campaignEntity.media.name;

    await this.postbackInstallAdbrixremasterRepository.save(postbackInstallAdbrixremaster);

    return;
  }

  async postbackEventAdbrixRemaster(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] event : ${originalUrl}`);

    const uuid: string = ['', undefined, '{uuid}'].includes(request.query.uuid) ? '' : request.query.uuid;

    const postbackEventAdbrixremaster: PostbackEventAdbrixremaster = this.postbackEventAdbrixremasterRepository.create({
      viewCode: request.query.cb_2,
      token: request.query.cb_1,
      aKey: request.query.a_key,
      aCookie: request.query.a_cookie,
      aIp: request.query.a_ip,
      aFp: request.query.a_fp,
      aCountry: request.query.a_country,
      aCity: request.query.a_city,
      aRegion: request.query.a_region,
      aAppkey: request.query.a_appkey,
      mPublisher: request.query.m_publisher,
      mSubPublisher: request.query.m_sub_publisher,
      attrAdid: request.query.attr_adid,
      attrEventDatetime: moment.utc(request.query.attr_event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      attrEventTimestamp: request.query.attr_event_timestamp,
      attrSecondsGap: request.query.attr_seconds_gap,
      adid: request.query.adid,
      idfv: request.query.idfv,
      adIdOptOut: request.query.ad_id_opt_out,
      deviceOsVersion: request.query.device_os_version,
      deviceModel: request.query.device_model,
      deviceVendor: request.query.device_vendor,
      deviceResolution: request.query.device_resolution,
      devicePortrait: request.query.device_portrait,
      devicePlatform: request.query.device_platform,
      deviceNetwork: request.query.device_network,
      deviceWifi: request.query.device_wifi,
      deviceCarrier: request.query.device_carrier,
      deviceLanguage: request.query.device_language,
      deviceCountry: request.query.device_country,
      deviceBuildId: request.query.device_build_id,
      packageName: request.query.package_name,
      appkey: request.query.appkey,
      sdkVersion: request.query.sdk_version,
      installer: request.query.installer,
      appVersion: request.query.app_version,
      eventName: request.query.event_name,
      eventDatetime: moment.utc(request.query.event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      eventTimestamp: request.query.event_timestamp,
      eventTimestampD: request.query.event_timestamp_d,
      cb_1: request.query.cb_1,
      cb_2: request.query.cb_2,
      cb_3: request.query.cb_3,
      cb_4: request.query.cb_4,
      cb_5: request.query.cb_5,
      paramJson: request.query.param_json,
      originalUrl: originalUrl,
      revenue: 0,
    });

    const token: string = postbackEventAdbrixremaster.token;
    const viewCode: string = postbackEventAdbrixremaster.viewCode;

    if (postbackEventAdbrixremaster.paramJson != 'null' && postbackEventAdbrixremaster.paramJson != '') {
      const jsonData: any = JSON.parse(postbackEventAdbrixremaster.paramJson);

      if (jsonData['abx:item.abx:sales']) {
        postbackEventAdbrixremaster.revenue = +jsonData['abx:item.abx:sales'];
        postbackEventAdbrixremaster.currency = jsonData['abx:item.abx:currency'];
      } else if (jsonData['abx:items']) {
        for (const item of jsonData['abx:items']) {
          postbackEventAdbrixremaster.revenue += +item['abx:sales'];
          postbackEventAdbrixremaster.currency = item['abx:currency'];
        }
      }
    }

    const postbackDailyEntity: PostbackDaily = await this.commonService.isValidationPostbackDaily(viewCode, token);

    if (!postbackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { token: token },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postbackEventEntity: PostbackRegisteredEvent = await this.postbackEventRepository.findOne({
      where: { token: token, tracker: postbackEventAdbrixremaster.eventName },
    });

    if (!postbackEventEntity) {
      await this.commonService.postbackUnregisteredEvent(postbackDailyEntity, postbackEventAdbrixremaster.eventName);
    }

    if (postbackEventEntity && postbackEventEntity.status) {
      const url: string = await this.commonService.convertedPostbackEventUrl({
        uuid: uuid,
        click_id: postbackEventAdbrixremaster.cb_3,
        adid: postbackEventAdbrixremaster.adid,
        event_name: postbackEventAdbrixremaster.eventName,
        event_datetime: postbackEventAdbrixremaster.eventDatetime,
        install_datetime: postbackEventAdbrixremaster.attrEventDatetime,
        campaignEntity: campaignEntity,
        postbackDailyEntity: postbackDailyEntity,
      });

      postbackEventAdbrixremaster.sendTime = await this.commonService.httpServiceHandler(url);
      postbackEventAdbrixremaster.sendUrl = url;
    }

    postbackEventAdbrixremaster.pubId = postbackDailyEntity.pubId;
    postbackEventAdbrixremaster.subId = postbackDailyEntity.subId;
    postbackEventAdbrixremaster.media = campaignEntity.media.name;

    await this.postbackEventAdbrixremasterRepository.save(postbackEventAdbrixremaster);

    return;
  }
}
