import {
  PostbackEventAdbrixremaster,
  PostbackEventAdjust,
  PostbackEventAirbridge,
  PostbackEventAppsflyer,
  PostbackEventMobiconnect,
  PostbackEventSingular,
  PostbackEventTradingworks,
  PostbackInstallAdbrixremaster,
  PostbackInstallAdjust,
  PostbackInstallAirbridge,
  PostbackInstallAppsflyer,
  PostbackInstallMobiconnect,
  PostbackInstallSingular,
  PostbackInstallTradingworks,
} from '@entities/Entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Redis } from 'ioredis';
import { InjectModel } from '@nestjs/mongoose';
import { AirbridgeInstall, AirbridgeInstallDocument } from 'src/schema/airbridge_install';
import { Model } from 'mongoose';
import { AirbridgeEvent, AirbridgeEventDocument } from 'src/schema/airbridge_event';
import { TradingworksInstall, TradingworksInstallDocument } from 'src/schema/tradingworks_install';
import { TradingworksEvent, TradingworksEventDocument } from 'src/schema/tradingworks_event';
import { SingularInstall, SingularInstallDocument } from 'src/schema/singular_install';
import { SingularEvent, SingularEventDocument } from 'src/schema/singular_event';
import { AppsflyerInstall, AppsflyerInstallDocument } from 'src/schema/appsflyer_install';
import { AppsflyerEvent, AppsflyerEventDocument } from 'src/schema/appsflyer_event';
import { AdjustEvent, AdjustEventDocument } from 'src/schema/adjust_event';
import { AdjustInstall, AdjustInstallDocument } from 'src/schema/adjust_install';
import { MobiconnectInstall, MobiconnectInstallDocument } from 'src/schema/mobiconnect_install';
import { MobiconnectEvent, MobiconnectEventDocument } from 'src/schema/mobiconnect_event';
import { AdbrixremasterInstall, AdbrixremasterInstallDocument } from 'src/schema/adbrixremaster_install';
import { AdbrixremasterEvent, AdbrixremasterEventDocument } from 'src/schema/adbrixremaster_event';

@Injectable()
export class PostbackService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackInstallAirbridge) private readonly postBackInstallAirbridgeRepository: Repository<PostbackInstallAirbridge>,
    @InjectRepository(PostbackEventAirbridge) private readonly postBackEventAirbridgeRepository: Repository<PostbackEventAirbridge>,
    @InjectRepository(PostbackInstallTradingworks) private readonly postbackInstallTradingworksRepository: Repository<PostbackInstallTradingworks>,
    @InjectRepository(PostbackEventTradingworks) private readonly postbackEventTradingworksRepository: Repository<PostbackEventTradingworks>,
    @InjectRepository(PostbackInstallAppsflyer) private readonly postbackInstallAppsflyerRepository: Repository<PostbackInstallAppsflyer>,
    @InjectRepository(PostbackEventAppsflyer) private readonly postbackEventAppsflyerRepository: Repository<PostbackEventAppsflyer>,
    @InjectRepository(PostbackInstallAdbrixremaster) private readonly postbackInstallAdbrixremasterRepository: Repository<PostbackInstallAdbrixremaster>,
    @InjectRepository(PostbackEventAdbrixremaster) private readonly postbackEventAdbrixremasterRepository: Repository<PostbackEventAdbrixremaster>,
    @InjectRepository(PostbackInstallAdjust) private readonly postbackInstallAdjustRepository: Repository<PostbackInstallAdjust>,
    @InjectRepository(PostbackEventAdjust) private readonly postbackEventAdjustRepository: Repository<PostbackEventAdjust>,
    @InjectRepository(PostbackInstallSingular) private readonly postbackInstallSingularRepository: Repository<PostbackInstallSingular>,
    @InjectRepository(PostbackEventSingular) private readonly postbackEventSingularRepository: Repository<PostbackEventSingular>,
    @InjectRepository(PostbackInstallMobiconnect) private readonly postbackInstallMobiconnectRepository: Repository<PostbackInstallMobiconnect>,
    @InjectRepository(PostbackEventMobiconnect) private readonly postbackEventMobiconnectRepository: Repository<PostbackEventMobiconnect>,
    @InjectModel(AirbridgeInstall.name) private airbridgeInstallModel: Model<AirbridgeInstallDocument>,
    @InjectModel(AirbridgeEvent.name) private airbridgeEventModel: Model<AirbridgeEventDocument>,
    @InjectModel(TradingworksInstall.name) private tradingworksInstallModel: Model<TradingworksInstallDocument>,
    @InjectModel(TradingworksEvent.name) private tradingworksEventModel: Model<TradingworksEventDocument>,
    @InjectModel(SingularInstall.name) private singularInstallModel: Model<SingularInstallDocument>,
    @InjectModel(SingularEvent.name) private singularEventModel: Model<SingularEventDocument>,
    @InjectModel(AppsflyerInstall.name) private appsflyerInstallModel: Model<AppsflyerInstallDocument>,
    @InjectModel(AppsflyerEvent.name) private appsflyerEventModel: Model<AppsflyerEventDocument>,
    @InjectModel(AdjustInstall.name) private adjustInstallModel: Model<AdjustInstallDocument>,
    @InjectModel(AdjustEvent.name) private adjustEventModel: Model<AdjustEventDocument>,
    @InjectModel(MobiconnectInstall.name) private mobiconnectInstallModel: Model<MobiconnectInstallDocument>,
    @InjectModel(MobiconnectEvent.name) private mobiconnectEventModel: Model<MobiconnectEventDocument>,
    @InjectModel(AdbrixremasterInstall.name) private adbrixremasterInstallModel: Model<AdbrixremasterInstallDocument>,
    @InjectModel(AdbrixremasterEvent.name) private adbrixremasterEventModel: Model<AdbrixremasterEventDocument>,
  ) {}

  async installAirbridge(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ airbridge ---> mecrosspro ] install : ${originalUrl}`);

    await this.airbridgeInstallModel.create({
      ...request.query,
      limitAdTracking: Boolean(request.query.limitAdTracking),
      isUnique: Boolean(request.query.isUnique),
    });

    const postbackInstallAirbridge: PostbackInstallAirbridge = this.postBackInstallAirbridgeRepository.create({
      clickId: request.query.click_id,
      subId2: request.query.sub_id,
      uuid: request.query.uuid,
      googleAid: request.query.google_aid,
      iosIdfa: request.query.ios_idfa,
      iosIfv: request.query.ios_ifv,
      limitAdTracking: request.query.limitAdTracking,
      deviceModel: request.query.device_model,
      deviceManufacturer: request.query.device_manufacturer,
      deviceType: request.query.device_type,
      os: request.query.os,
      osVersion: request.query.os_version,
      locale: request.query.locale,
      language: request.query.language,
      country: request.query.country,
      deviceCarrier: request.query.device_carrier,
      timezone: request.query.timezone,
      deviceIp: request.query.device_ip,
      packageName: request.query.packageName,
      iTunesAppId: request.query.iTunesAppId,
      appVersion: request.query.appVersion,
      appName: request.query.appName,
      sdkVersion: request.query.sdkVersion,
      isUnique: request.query.isUnique,
      eventDatetime: request.query.event_datetime,
      eventTimestamp: request.query.event_timestamp,
      installTimestamp: request.query.install_timestamp,
      clickDatetime: request.query.click_datetime,
      clickTimestamp: request.query.click_timestamp,
      deeplink: request.query.deeplink,
      googleReferrer: request.query.googleReferrer,
      attributedChannel: request.query.attributedChannel,
      attributedMatchingType: request.query.attributedMatchingType,
      customParam1: request.query.custom_param1,
      customParam2: request.query.custom_param2,
      customParam3: request.query.custom_param3,
      customParam4: request.query.custom_param4,
      customParam5: request.query.custom_param5,
      originalUrl: originalUrl,
      viewCode: request.query.sub_id,
      token: request.query.custom_param1,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('airbridge:install', date, JSON.stringify(postbackInstallAirbridge));
  }
  async eventAirbridge(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ airbridge ---> mecrosspro ] event : ${originalUrl}`);

    await this.airbridgeEventModel.create({
      ...request.query,
      limitAdTracking: Boolean(request.query.limitAdTracking),
      isUnique: Boolean(request.query.isUnique),
      inAppPurchased: Boolean(request.query.inAppPurchased),
    });

    const postbackEventAirbridge: PostbackEventAirbridge = this.postBackEventAirbridgeRepository.create({
      clickId: request.query.click_id,
      subId2: request.query.sub_id,
      uuid: request.query.uuid,
      googleAid: request.query.google_aid,
      iosIdfa: request.query.ios_idfa,
      iosIfv: request.query.ios_ifv,
      limitAdTracking: request.query.limitAdTracking,
      deviceModel: request.query.device_model,
      deviceManufacturer: request.query.device_manufacturer,
      os: request.query.os,
      osVersion: request.query.os_version,
      locale: request.query.locale,
      language: request.query.language,
      country: request.query.country,
      deviceCarrier: request.query.device_carrier,
      timezone: request.query.timezone,
      deviceIp: request.query.device_ip,
      packageName: request.query.packageName,
      iTunesAppId: request.query.iTunesAppID,
      appVersion: request.query.appVersion,
      appName: request.query.appName,
      sdkVersion: request.query.sdkVersion,
      eventType: request.query.event_type,
      isUnique: request.query.isUnique,
      isGoalCategoryUnique: request.query.isGoalCategoryUnique,
      eventDatetime: request.query.event_datetime,
      eventTimestamp: request.query.event_timestamp,
      installTimestamp: request.query.install_timestamp,
      clickDatetime: request.query.click_datetime,
      clickTimestamp: request.query.click_timestamp,
      deeplink: request.query.deeplink,
      googleReferrer: request.query.googleReferrer,
      category: request.query.category,
      eventName: request.query.eventName,
      eventLabel: request.query.eventLabel,
      eventValue: request.query.eventValue,
      inAppPurchased: request.query.inAppPurchased,
      transactionId: request.query.transactionID,
      productInfo: request.query.product_info,
      revenue: 0,
      currency: '',
      attributedChannel: request.query.attributedChannel,
      campaign: request.query.campaign,
      adType: request.query.ad_type,
      adGroup: request.query.ad_group,
      adCreative: request.query.ad_creative,
      attributedMatchingType: request.query.attributedMatchingType,
      customParam1: request.query.custom_param1,
      customParam2: request.query.custom_param2,
      customParam3: request.query.custom_param3,
      customParam4: request.query.custom_param4,
      customParam5: request.query.custom_param5,
      originalUrl: originalUrl,
      viewCode: request.query.sub_id,
      token: request.query.custom_param1,
    });

    if (postbackEventAirbridge.productInfo) {
      const productInfo: {
        currency: string;
        productId: string;
        productName: string;
        productPrice: number;
        quantity: number;
      }[] = JSON.parse(postbackEventAirbridge.productInfo);

      for (let i = 0; i < productInfo.length; i++) {
        postbackEventAirbridge.revenue += productInfo[i].productPrice;
        postbackEventAirbridge.currency = productInfo[i].currency;
      }
    }

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('airbridge:event', date, JSON.stringify(postbackEventAirbridge));
  }

  async installTradingworks(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ tradingworks ---> mecrosspro ] install : ${originalUrl}`);

    await this.tradingworksInstallModel.create({
      ...request.query,
    });

    const postbackInstallTradingworks: PostbackInstallTradingworks = this.postbackInstallTradingworksRepository.create({
      viewCode: request.query.publisher_id,
      token: request.query.cb_param1,
      transactionId: request.query.transaction_id,
      publisherId: request.query.publisher_id,
      adid: request.query.adid,
      idfa: request.query.idfa,
      countryCode: request.query.country_code,
      deviceBrand: request.query.device_brand,
      deviceCarrier: request.query.device_carrier,
      deviceIp: request.query.device_ip,
      deviceModel: request.query.device_model,
      deviceType: request.query.device_type,
      cbParam1: request.query.cb_param1,
      cbParam2: request.query.cb_param2,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('tradingworks:install', date, JSON.stringify(postbackInstallTradingworks));
  }
  async eventTradingworks(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ tradingworks ---> mecrosspro ] event : ${originalUrl}`);

    await this.tradingworksEventModel.create({
      ...request.query,
    });

    const postbackEventTradingworks: PostbackEventTradingworks = this.postbackEventTradingworksRepository.create({
      viewCode: request.query.publisher_id,
      token: request.query.cb_param1,
      transactionId: request.query.transaction_id,
      publisherId: request.query.publisher_id,
      adid: request.query.adid,
      idfa: request.query.idfa,
      countryCode: request.query.country_code,
      deviceBrand: request.query.device_brand,
      deviceCarrier: request.query.device_carrier,
      deviceIp: request.query.device_ip,
      deviceModel: request.query.device_model,
      deviceType: request.query.device_type,
      cbParam1: request.query.cb_param1,
      cbParam2: request.query.cb_param2,
      action: request.query.action,
      originalUrl: request.query.originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('tradingworks:event', date, JSON.stringify(postbackEventTradingworks));
  }

  async installAppsflyer(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ appsflyer ---> mecrosspro ] install : ${originalUrl}`);

    await this.appsflyerInstallModel.create({
      ...request.query,
    });

    const postbackInstallAppsflyer: PostbackInstallAppsflyer = this.postbackInstallAppsflyerRepository.create({
      viewCode: request.query.af_siteid,
      token: request.query.af_c_id,
      clickid: request.query.clickid,
      afSiteid: request.query.af_siteid,
      afCId: request.query.af_c_id,
      advertisingId: request.query.advertising_id,
      idfa: request.query.idfa,
      idfv: request.query.idfv,
      installTime: moment(moment.utc(request.query.install_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      countryCode: request.query.country_code,
      language: request.query.language,
      clickTime: moment(moment.utc(request.query.click_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      deviceCarrier: request.query.device_carrier,
      deviceIp: request.query.device_ip,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('appsflyer:install', date, JSON.stringify(postbackInstallAppsflyer));
  }
  async eventAppsflyer(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ appsflyer ---> mecrosspro ] event : ${originalUrl}`);

    await this.appsflyerEventModel.create({
      ...request.query,
      event_revenue: request.query.event_revenue == 'N/A' ? 0 : request.query.event_revenue,
    });

    const postbackEventAppsflyer: PostbackEventAppsflyer = this.postbackEventAppsflyerRepository.create({
      viewCode: request.query.af_siteid,
      token: request.query.af_c_id,
      clickid: request.query.clickid,
      afSiteid: request.query.af_siteid,
      afCId: request.query.af_c_id,
      advertisingId: request.query.advertising_id,
      idfa: request.query.idfa,
      idfv: request.query.idfv,
      installTime: moment(moment.utc(request.query.install_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      countryCode: request.query.country_code,
      language: request.query.language,
      eventName: request.query.event_name,
      eventRevenueCurrency: request.query.event_revenue_currency == 'N/A' ? '' : request.query.event_revenue_currency,
      eventRevenue: request.query.event_revenue == 'N/A' ? 0 : request.query.event_revenue,
      eventTime: moment(moment.utc(request.query.event_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      deviceCarrier: request.query.device_carrier,
      deviceIp: request.query.device_ip,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('appsflyer:event', date, JSON.stringify(postbackEventAppsflyer));
  }

  async installAdbrixremaster(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] install : ${originalUrl}`);

    await this.adbrixremasterInstallModel.create({
      ...request.query,
      a_server_datetime: request.query.a_server_datetime.replace('+', ' '),
      event_datetime: request.query.event_datetime.replace('+', ' '),
    });

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

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('adbrixremaster:install', date, JSON.stringify(postbackInstallAdbrixremaster));
  }
  async eventAdbrixremaster(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] event : ${originalUrl}`);

    await this.adbrixremasterEventModel.create({
      ...request.query,
      attr_event_datetime: request.query.attr_event_datetime.replace('+', ' '),
      event_datetime: request.query.event_datetime.replace('+', ' '),
    });

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

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('adbrixremaster:event', date, JSON.stringify(postbackEventAdbrixremaster));
  }

  async installAdjust(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adjust ---> mecrosspro ] install : ${originalUrl}`);

    await this.adjustInstallModel.create({
      ...request.query,
    });

    const postbackInstallAdjust: PostbackInstallAdjust = this.postbackInstallAdjustRepository.create({
      cpToken: request.query.cp_token,
      publisherId: request.query.publisher_id,
      clickId: request.query.click_id,
      uid: request.query.uid,
      appId: request.query.app_id,
      appVersion: request.query.app_version,
      networkName: request.query.network_name,
      campaignName: request.query.campaign_name,
      adgroupName: request.query.adgroup_name,
      adid: request.query.adid,
      idfa: request.query.idfa,
      idfv: request.query.idfv,
      androidId: request.query.android_id,
      gpsAdid: request.query.gps_adid,
      ipAddress: request.query.ip_address,
      clickTime: request.query.click_time,
      engagementTime: request.query.engagement_time,
      installedAt: request.query.installed_at,
      isp: request.query.isp,
      country: request.query.country,
      language: request.query.language,
      deviceName: request.query.device_name,
      deviceType: request.query.device_type,
      osName: request.query.os_name,
      sdkVersion: request.query.sdk_version,
      osVersion: request.query.os_version,
      token: request.query.cp_token,
      viewCode: request.query.publisher_id,
      originalUrl: originalUrl,
    });
    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('adjust:install', date, JSON.stringify(postbackInstallAdjust));
  }
  async eventAdjust(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adjust ---> mecrosspro ] event : ${originalUrl}`);

    await this.adjustEventModel.create({
      ...request.query,
    });

    const postbackEventAdjust: PostbackEventAdjust = this.postbackEventAdjustRepository.create({
      eventToken: request.query.event_token,
      eventType: request.query.event_type,
      cpToken: request.query.cp_token,
      publisherId: request.query.publisher_id,
      clickId: request.query.click_id,
      uid: request.query.uid,
      appId: request.query.app_id,
      appVersion: request.query.app_version,
      networkName: request.query.network_name,
      campaignName: request.query.campaign_name,
      adgroupName: request.query.adgroup_name,
      adid: request.query.adid,
      idfa: request.query.idfa,
      idfv: request.query.idfv,
      androidId: request.query.android_id,
      gpsAdid: request.query.gps_adid,
      ipAddress: request.query.ip_address,
      clickTime: request.query.click_time,
      engagementTime: request.query.engagement_time,
      installedAt: request.query.installed_at,
      createdAt2: request.query.created_at,
      isp: request.query.isp,
      country: request.query.country,
      language: request.query.language,
      deviceName: request.query.device_name,
      deviceType: request.query.device_type,
      osName: request.query.os_name,
      sdkVersion: request.query.sdk_version,
      osVersion: request.query.os_version,
      currency: request.query.currency,
      revenue: request.query.revenue,
      revenueFloat: request.query.revenue_float,
      revenueUsd: request.query.revenue_usd,
      revenueUsdCents: request.query.revenue_usd_cents,
      reportingRevenue: request.query.reporting_revenue,
      reportingCurrency: request.query.reporting_currency,
      viewCode: request.query.publisher_id,
      token: request.query.cp_token,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('adjust:event', date, JSON.stringify(postbackEventAdjust));
  }

  async installSingular(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ singular ---> mecrosspro ] install : ${originalUrl}`);

    await this.singularInstallModel.create({
      ...request.query,
    });

    const postbackIntallSingular: PostbackInstallSingular = this.postbackInstallSingularRepository.create({
      viewCode: request.query.sub2,
      token: request.query.sub1,
      attributionIp: request.query.attribution_ip,
      osVersion: request.query.os_version,
      appVersion: request.query.app_version,
      idfa: request.query.idfa,
      idfv: request.query.idfv,
      gaid: request.query.gaid,
      attributionCountry: request.query.attribution_country,
      platform: request.query.platform,
      time: request.query.time,
      utc: request.query.utc,
      clickTime: request.query.click_time,
      clickUtc: request.query.click_utc,
      sub1: request.query.sub1,
      sub2: request.query.sub2,
      sub3: request.query.sub3,
      sub4: request.query.sub4,
      sub5: request.query.sub5,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('singular:install', date, JSON.stringify(postbackIntallSingular));
  }
  async eventSingular(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ singular ---> mecrosspro ] event : ${originalUrl}`);

    await this.singularEventModel.create({
      ...request.query,
    });

    const postbackEventSingular: PostbackEventSingular = this.postbackEventSingularRepository.create({
      viewCode: request.query.sub2,
      token: request.query.sub1,
      attributionIp: request.query.attribution_ip,
      osVersion: request.query.os_version,
      appVersion: request.query.app_version,
      idfa: request.query.idfa,
      idfv: request.query.idfv,
      gaid: request.query.gaid,
      attributionCountry: request.query.attribution_country,
      platform: request.query.platform,
      amount: request.query.amount,
      currency: request.query.currency,
      eventName: request.query.event_name,
      eventAttrs: request.query.event_attrs,
      time: request.query.time,
      utc: request.query.utc,
      clickTime: request.query.click_time,
      clickUtc: request.query.click_utc,
      sub1: request.query.sub1,
      sub2: request.query.sub2,
      sub3: request.query.sub3,
      sub4: request.query.sub4,
      sub5: request.query.sub5,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('singular:event', date, JSON.stringify(postbackEventSingular));
  }

  async installMobiconnect(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ mobiconnect ---> mecrosspro ] install : ${originalUrl}`);

    await this.mobiconnectInstallModel.create({
      ...request.query,
    });

    const postbackInstallMobiconnect: PostbackInstallMobiconnect = this.postbackInstallMobiconnectRepository.create({
      viewCode: request.query.pub_id,
      token: request.query.custom1,
      pubId2: request.query.pub_id2,
      subPubId: request.query.sub_pub_id,
      clickId: request.query.click_id,
      gaid: request.query.gaid,
      idfa: request.query.idfa,
      androidId: request.query.android_id,
      os: request.query.os,
      ip: request.query.ip,
      carrier: request.query.carrier,
      countryCode: request.query.country_code,
      language: request.query.language,
      clickTimestamp: request.query.click_timestamp,
      installTimestamp: request.query.install_timestamp,
      custom1: request.query.custom1,
      custom2: request.query.custom2,
      custom3: request.query.custom3,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('mobiconnect:install', date, JSON.stringify(postbackInstallMobiconnect));
  }
  async eventMobiconnect(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ mobiconnect ---> mecrosspro ] event : ${originalUrl}`);

    await this.mobiconnectEventModel.create({
      ...request.query,
    });

    const postbackEventMobiconnect: PostbackEventMobiconnect = this.postbackEventMobiconnectRepository.create({
      viewCode: request.query.pub_id,
      token: request.query.custom1,
      pubId2: request.query.pub_id,
      subPubId: request.query.sub_pub_id,
      clickId: request.query.click_id,
      gaid: request.query.gaid,
      idfa: request.query.idfa,
      androidId: request.query.android_id,
      os: request.query.os,
      ip: request.query.ip,
      carrier: request.query.carrier,
      countryCode: request.query.country_code,
      language: request.query.language,
      clickTimestamp: request.query.click_timestamp,
      installTimestamp: request.query.install_timestamp,
      eventTimestamp: request.query.event_timestamp,
      eventId: request.query.event_id,
      revenue: request.query.revenue,
      currency: request.query.currency,
      custom1: request.query.custom1,
      custom2: request.query.custom2,
      custom3: request.query.custom,
      originalUrl: originalUrl,
    });
    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('mobiconnect:event', date, JSON.stringify(postbackEventMobiconnect));
  }
}
