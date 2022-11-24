import {
  PostbackEventAdbrixremaster,
  PostbackEventAdjust,
  PostbackEventAirbridge,
  PostbackEventAppsflyer,
  PostbackEventDecotra,
  PostbackEventIve,
  PostbackEventMobiconnect,
  PostbackEventSingular,
  PostbackEventTradingworks,
  PostbackInstallAdbrixremaster,
  PostbackInstallAdjust,
  PostbackInstallAirbridge,
  PostbackInstallAppsflyer,
  PostbackInstallDecotra,
  PostbackInstallIve,
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
import { Postback, PostbackDocument } from 'src/schema/postback';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IveInstall, IveInstallDocument } from 'src/schema/ive_install';
import { IveEvent, IveEventDocument } from 'src/schema/ive_event';
import { DecotraInstall, DecotraInstallDocument } from 'src/schema/decotra_install';
import { DecotraEvent, DecotraEventDocument } from 'src/schema/decotra_event';

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
    @InjectRepository(PostbackInstallIve) private readonly postbackInstallIveRepository: Repository<PostbackInstallIve>,
    @InjectRepository(PostbackEventIve) private readonly postbackEventIveRepository: Repository<PostbackEventIve>,
    @InjectRepository(PostbackInstallDecotra) private readonly postbackInstallDecotraRepository: Repository<PostbackInstallDecotra>,
    @InjectRepository(PostbackEventDecotra) private readonly postbackEventDecotraRepository: Repository<PostbackEventDecotra>,
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
    @InjectModel(IveInstall.name) private iveInstallModel: Model<IveInstallDocument>,
    @InjectModel(IveEvent.name) private iveEventModel: Model<IveEventDocument>,
    @InjectModel(DecotraInstall.name) private decotraInstallModel: Model<DecotraInstallDocument>,
    @InjectModel(DecotraEvent.name) private decotraEventModel: Model<DecotraEventDocument>,
    @InjectQueue('postback') private readonly postbackQueue: Queue,
    @InjectQueue('adbrixremasterEvent') private readonly adbrixremasterEventQueue: Queue,
    @InjectQueue('adbrixremasterInstall') private readonly adbrixremasterInstallQueue: Queue,
  ) {}

  async installAirbridge(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ airbridge ---> mecrosspro ] install : ${originalUrl}`);
    //-------------------------------------------------------------------------------------------------------
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
    //-------------------------------------------------------------------------------------------------------

    await this.airbridgeInstallModel.create({
      ...request.query,
      limitAdTracking: Boolean(request.query.limitAdTracking),
      isUnique: Boolean(request.query.isUnique),
    });

    await this.postbackQueue.add(
      {
        token: request.query.custom_param1,
        impressionCode: request.query.sub_id,
        click_id: request.query.click_id,
        event_name: 'install',
        carrier: request.query.device_carrier,
        country: request.query.country,
        language: request.query.language,
        ip: request.query.device_ip,
        adid: request.query.uuid,
        click_time: moment(request.query.click_datetime).format('YYYY-MM-DD HH:mm:ss'),
        install_time: moment(request.query.event_datetime).format('YYYY-MM-DD HH:mm:ss'),
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }
  async eventAirbridge(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ airbridge ---> mecrosspro ] event : ${originalUrl}`);

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

    //-------------------------------------------------------------------------------------------------------
    await this.airbridgeEventModel.create({
      ...request.query,
      limitAdTracking: Boolean(request.query.limitAdTracking),
      isUnique: Boolean(request.query.isUnique),
      inAppPurchased: Boolean(request.query.inAppPurchased),
    });

    let revenue: number = 0;
    let currency: string;

    if (request.query.product_info) {
      const productInfo: any = JSON.parse(postbackEventAirbridge.productInfo);

      for (let i = 0; i < productInfo.length; i++) {
        revenue += +productInfo[i].productPrice;
        currency = productInfo[i].currency;
      }
    }

    await this.postbackQueue.add(
      {
        token: request.query.custom_param1,
        carrier: request.query.device_carrier,
        country: request.query.country,
        language: request.query.language,
        ip: request.query.device_ip,
        adid: request.query.uuid,
        click_id: request.query.click_id,
        impressionCode: request.query.sub_id,
        event_name: request.query.eventName,
        click_time: moment(request.query.click_datetime).format('YYYY-MM-DD HH:mm:ss'),
        event_time: moment(request.query.event_datetime).format('YYYY-MM-DD HH:mm:ss'),
        revenue: revenue,
        currency: currency,
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }

  async installTradingworks(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ tradingworks ---> mecrosspro ] install : ${originalUrl}`);

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

    //-------------------------------------------------------------------------------------------------------
    await this.tradingworksInstallModel.create({
      ...request.query,
    });

    await this.postbackQueue.add(
      {
        token: request.query.cb_param1,
        impressionCode: request.query.publisher_id,
        click_id: request.query.transaction_id,
        event_name: 'install',
        carrier: request.query.device_carrier,
        country: request.query.country_code,
        ip: request.query.device_ip,
        adid: request.query.adid ? request.query.adid : request.query.idfa,
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }
  async eventTradingworks(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ tradingworks ---> mecrosspro ] event : ${originalUrl}`);

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
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('tradingworks:event', date, JSON.stringify(postbackEventTradingworks));

    //-------------------------------------------------------------------------------------------------------
    await this.tradingworksEventModel.create({
      ...request.query,
    });

    await this.postbackQueue.add(
      {
        token: request.query.cb_param1,
        impressionCode: request.query.publisher_id,
        click_id: request.query.transaction_id,
        event_name: request.query.action,
        carrier: request.query.device_carrier,
        country: request.query.country_code,
        ip: request.query.device_ip,
        adid: request.query.adid ? request.query.adid : request.query.idfa,
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }

  async installAppsflyer(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ appsflyer ---> mecrosspro ] install : ${originalUrl}`);
    //-------------------------------------------------------------------------------------------------------
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
    //-------------------------------------------------------------------------------------------------------

    await this.appsflyerInstallModel.create({
      ...request.query,
    });

    await this.postbackQueue.add(
      {
        token: request.query.af_c_id,
        impressionCode: request.query.af_siteid,
        click_id: request.query.clickid,
        event_name: 'install',
        carrier: request.query.device_carrier,
        country: request.query.country_code,
        language: request.query.language,
        ip: request.query.device_ip,
        adid: request.query.idfa ? request.query.idfa : request.query.idfv,
        click_time: moment(moment.utc(request.query.click_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
        install_time: moment(moment.utc(request.query.install_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }
  async eventAppsflyer(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ appsflyer ---> mecrosspro ] event : ${originalUrl}`);

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

    //-------------------------------------------------------------------------------------------------------
    await this.appsflyerEventModel.create({
      ...request.query,
      event_revenue: request.query.event_revenue == 'N/A' ? 0 : request.query.event_revenue,
    });

    await this.postbackQueue.add(
      {
        token: request.query.af_c_id,
        carrier: request.query.device_carrier,
        country: request.query.country_code,
        language: request.query.language,
        ip: request.query.device_ip,
        adid: request.query.idfa ? request.query.idfa : request.query.idfv,
        click_id: request.query.clickid,
        impressionCode: request.query.af_siteid,
        event_name: request.query.event_name,
        install_time: moment(moment.utc(request.query.install_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
        event_time: moment(moment.utc(request.query.event_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
        revenue: request.query.event_revenue == 'N/A' ? 0 : request.query.event_revenue,
        currency: request.query.event_revenue_currency == 'N/A' ? '' : request.query.event_revenue_currency,
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }

  async installAdbrixremaster(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] install : ${originalUrl}`);
    //-------------------------------------------------------------------------------------------------------
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

    await this.adbrixremasterInstallQueue.add(postbackInstallAdbrixremaster, { removeOnComplete: true, removeOnFail: true, attempts: 2 });
    // const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    // const redis: Redis = this.redisService.getClient();
    // await redis.hset('adbrixremaster:install', date, JSON.stringify(postbackInstallAdbrixremaster));
    //-------------------------------------------------------------------------------------------------------
    await this.adbrixremasterInstallModel.create({
      ...request.query,
      a_server_datetime: request.query.a_server_datetime.replace('+', ' '),
      event_datetime: request.query.event_datetime.replace('+', ' '),
    });

    await this.postbackQueue.add(
      {
        token: request.query.cb_1,
        impressionCode: request.query.cb_2,
        click_id: request.query.cb_3,
        event_name: 'install',
        carrier: request.query.device_carrier,
        country: request.query.device_country,
        language: request.query.device_language,
        ip: request.query.a_ip,
        adid: request.query.adid ? request.query.adid : request.query.idfv,
        click_time: request.query.a_server_datetime.replace('+', ' '),
        install_time: request.query.event_datetime.replace('+', ' '),
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }
  async eventAdbrixremaster(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] event : ${originalUrl}`);

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

    await this.adbrixremasterEventQueue.add(postbackEventAdbrixremaster, { removeOnComplete: true, removeOnFail: true, attempts: 2 });

    // const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    // const redis: Redis = this.redisService.getClient();
    // await redis.hset('adbrixremaster:event', date, JSON.stringify(postbackEventAdbrixremaster));

    //-------------------------------------------------------------------------------------------------------
    await this.adbrixremasterEventModel.create({
      ...request.query,
      attr_event_datetime: request.query.attr_event_datetime.replace('+', ' '),
      event_datetime: request.query.event_datetime.replace('+', ' '),
    });

    let revenue: number = 0;
    let currency: string = '';

    if (request.query.param_json != 'null' && request.query.param_json != '' && request.query.param_json != null) {
      const jsonData: any = JSON.parse(request.query.param_json);

      if (jsonData['abx:item.abx:sales']) {
        revenue = +jsonData['abx:item.abx:sales'];
        currency = jsonData['abx:item.abx:currency'];
      } else if (jsonData['abx:items']) {
        for (const item of jsonData['abx:items']) {
          revenue += +item['abx:sales'] ? +item['abx:sales'] : 0;
          currency = item['abx:currency'];
        }
      }
    }

    await this.postbackQueue.add(
      {
        token: request.query.cb_1,
        carrier: request.query.device_carrier,
        country: request.query.device_country,
        language: request.query.device_language,
        ip: request.query.a_ip,
        adid: request.query.adid ? request.query.adid : request.query.idfv,
        click_id: request.query.cb_3,
        impressionCode: request.query.cb_2,
        event_name: request.query.event_name,
        install_time: moment.utc(request.query.attr_event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
        event_time: moment.utc(request.query.event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
        revenue: revenue,
        currency: currency,
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }

  async installAdjust(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adjust ---> mecrosspro ] install : ${originalUrl}`);

    //-------------------------------------------------------------------------------------------------------
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
    //-------------------------------------------------------------------------------------------------------
    await this.adjustInstallModel.create({
      ...request.query,
    });

    await this.postbackQueue.add(
      {
        token: request.query.cp_token,
        impressionCode: request.query.publisher_id,
        click_id: request.query.click_id,
        event_name: 'install',
        carrier: request.query.isp,
        country: request.query.country,
        language: request.query.language,
        ip: request.query.ip_address,
        adid: request.query.adid,
        click_time: moment.unix(request.query.click_time).format('YYYY-MM-DD HH:mm:ss'),
        install_time: moment.unix(request.query.installed_at).format('YYYY-MM-DD HH:mm:ss'),
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
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
    //-------------------------------------------------------------------------------------------------------
    await this.postbackQueue.add(
      {
        token: request.query.cp_token,
        carrier: request.query.isp,
        country: request.query.country,
        language: request.query.language,
        ip: request.query.ip_address,
        adid: request.query.adid ? request.query.adid : request.query.idfv,
        click_id: request.query.click_id,
        impressionCode: request.query.publisher_id,
        event_name: request.query.event_type,
        install_time: moment.unix(request.query.installed_at).format('YYYY-MM-DD HH:mm:ss'),
        event_time: moment.unix(request.query.created_at).format('YYYY-MM-DD HH:mm:ss'),
        revenue: request.query.revenue,
        currency: request.query.currency,
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }

  async installSingular(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ singular ---> mecrosspro ] install : ${originalUrl}`);

    //-------------------------------------------------------------------------------------------------------
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
    //-------------------------------------------------------------------------------------------------------
    await this.singularInstallModel.create({
      ...request.query,
    });

    await this.postbackQueue.add(
      {
        token: request.query.sub1,
        impressionCode: request.query.sub2,
        click_id: request.query.sub3,
        event_name: 'install',
        country: request.query.attribution_country,
        ip: request.query.attribution_ip,
        adid: request.query.gaid ? request.query.gaid : request.query.idfa,
        click_time: moment.unix(request.query.click_utc).format('YYYY-MM-DD HH:mm:ss'),
        install_time: moment.unix(request.query.utc).format('YYYY-MM-DD HH:mm:ss'),
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }
  async eventSingular(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ singular ---> mecrosspro ] event : ${originalUrl}`);

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
      eventAttrs: request.query.event_attrs,
      eventName: request.query.event_name,
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
    //-------------------------------------------------------------------------------------------------------
    await this.singularEventModel.create({
      ...request.query,
    });

    await this.postbackQueue.add(
      {
        token: request.query.sub1,
        country: request.query.attribution_country,
        ip: request.query.attribution_ip,
        adid: request.query.gaid ? request.query.gaid : request.query.idfa,
        click_id: request.query.sub3,
        impressionCode: request.query.sub2,
        event_name: request.query.event_name,
        install_time: moment.unix(request.query.click_utc).format('YYYY-MM-DD HH:mm:ss'),
        event_time: moment.unix(request.query.utc).format('YYYY-MM-DD HH:mm:ss'),
        revenue: request.query.amount,
        currency: request.query.currency,
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }

  async installMobiconnect(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ mobiconnect ---> mecrosspro ] install : ${originalUrl}`);

    //-------------------------------------------------------------------------------------------------------
    const postbackInstallMobiconnect: PostbackInstallMobiconnect = this.postbackInstallMobiconnectRepository.create({
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
      custom1: request.query.custom1,
      custom2: request.query.custom2,
      custom3: request.query.custom3,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('mobiconnect:install', date, JSON.stringify(postbackInstallMobiconnect));
    //-------------------------------------------------------------------------------------------------------
    await this.mobiconnectInstallModel.create({
      ...request.query,
    });

    await this.postbackQueue.add(
      {
        token: request.query.custom1,
        country: request.query.country_code,
        language: request.query.language,
        carrier: request.query.carrier,
        ip: request.query.ip,
        adid: request.query.gaid ? request.query.gaid : request.query.idfa,
        click_id: request.query.click_id,
        impressionCode: request.query.pub_id,
        event_name: request.query.event_id,
        click_time: moment.unix(request.query.click_timestamp).format('YYYY-MM-DD HH:mm:ss'),
        install_time: moment.unix(request.query.install_timestamp).format('YYYY-MM-DD HH:mm:ss'),
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }
  async eventMobiconnect(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ mobiconnect ---> mecrosspro ] event : ${originalUrl}`);

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

    //-------------------------------------------------------------------------------------------------------
    await this.mobiconnectEventModel.create({
      ...request.query,
    });

    await this.postbackQueue.add(
      {
        token: request.query.custom1,
        country: request.query.country_code,
        language: request.query.language,
        carrier: request.query.carrier,
        ip: request.query.ip,
        adid: request.query.gaid ? request.query.gaid : request.query.idfa,
        click_id: request.query.click_id,
        impressionCode: request.query.pub_id,
        event_name: request.query.event_id,
        install_time: moment.unix(request.query.install_timestamp).format('YYYY-MM-DD HH:mm:ss'),
        event_time: moment.unix(request.query.event_timestamp).format('YYYY-MM-DD HH:mm:ss'),
        revenue: request.query.revenue,
        currency: request.query.currency,
      },
      { removeOnComplete: true, removeOnFail: true, attempts: 2 },
    );
  }

  async installIve(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ ive ---> mecrosspro ] install : ${originalUrl}`);

    //-------------------------------------------------------------------------------------------------------
    const postbackInstallIve: PostbackInstallIve = this.postbackInstallIveRepository.create({
      pClk: request.query.p_clk,
      pub: request.query.pub,
      subPub: request.query.sub_pub,
      ao: request.query.ao,
      clickTime: request.query.click_time,
      clickTs: request.query.click_ts,
      installTime: request.query.install_time,
      installTs: request.query.install_ts,
      subParam1: request.query.sub_param1,
      subParam2: request.query.sub_param2,
      subParam3: request.query.sub_param3,
      subParam4: request.query.sub_param4,
      subParam5: request.query.sub_param5,
      adid: request.query.adid,
      idfa: request.query.idfa,
      ip: request.query.ip,
      os: request.query.os,
      osVer: request.query.os_ver,
      carrier: request.query.carrier,
      brand: request.query.brand,
      model: request.query.model,
      country: request.query.country,
      language: request.query.language,
      viewCode: request.query.pub,
      token: request.query.sub_param1,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('ive:install', date, JSON.stringify(postbackInstallIve));
    //-------------------------------------------------------------------------------------------------------
    await this.iveInstallModel.create({
      ...request.query,
    });
  }
  async eventIve(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ ive ---> mecrosspro ] event : ${originalUrl}`);

    //-------------------------------------------------------------------------------------------------------
    const postbackEventIve: PostbackEventIve = this.postbackEventIveRepository.create({
      pClk: request.query.p_clk,
      pub: request.query.pub,
      subPub: request.query.sub_pub,
      eventName: request.query.event_name,
      eventValue: request.query.event.value,
      eventTime: request.query.event_time,
      eventTs: request.query.event_ts,
      subParam1: request.query.sub_param1,
      subParam2: request.query.sub_param2,
      subParam3: request.query.sub_param3,
      subParam4: request.query.sub_param4,
      subParam5: request.query.sub_param5,
      adid: request.query.adid,
      idfa: request.query.idfa,
      platform: request.query.platform,
      osVer: request.query.os_ver,
      carrier: request.query.carrier,
      brand: request.query.brand,
      model: request.query.model,
      country: request.query.country,
      language: request.query.language,
      ip: request.query.ip,
      viewCode: request.query.pub,
      token: request.query.sub_param1,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('ive:event', date, JSON.stringify(postbackEventIve));
    //-------------------------------------------------------------------------------------------------------
    await this.iveEventModel.create({
      ...request.query,
    });
  }

  async installDecotra(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ decotra ---> mecrosspro ] install : ${originalUrl}`);

    //-------------------------------------------------------------------------------------------------------
    const postbackInstallDecotra: PostbackInstallDecotra = this.postbackInstallDecotraRepository.create({
      sub1: request.query.sub1,
      sub2: request.query.sub2,
      sub5: request.query.sub5,
      sub7: request.query.sub7,
      sub8: request.query.sub8,
      countryCode: request.query.country_code,
      deviceBrand: request.query.device_brand,
      deviceCarrier: request.query.device_carrier,
      deviceIp: request.query.device_ip,
      deviceModel: request.query.device_model,
      deviceType: request.query.device_type,
      viewCode: request.query.sub2,
      token: request.query.sub5,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('decotra:install', date, JSON.stringify(postbackInstallDecotra));
    //-------------------------------------------------------------------------------------------------------
    await this.decotraInstallModel.create({
      ...request.query,
    });
  }
  async eventDecotra(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ decotra ---> mecrosspro ] event : ${originalUrl}`);

    //-------------------------------------------------------------------------------------------------------
    const postbackEventDecotra: PostbackEventDecotra = this.postbackEventDecotraRepository.create({
      sub1: request.query.sub1,
      sub2: request.query.sub2,
      sub5: request.query.sub5,
      sub7: request.query.sub7,
      sub8: request.query.sub8,
      countryCode: request.query.country_code,
      deviceBrand: request.query.device_brand,
      deviceCarrier: request.query.device_carrier,
      deviceIp: request.query.device_ip,
      deviceModel: request.query.device_model,
      eventName: request.query.device_name,
      viewCode: request.query.sub2,
      token: request.query.sub5,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('decotra:event', date, JSON.stringify(postbackEventDecotra));
    //-------------------------------------------------------------------------------------------------------
    await this.decotraEventModel.create({
      ...request.query,
    });
  }
}
