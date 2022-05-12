import { PostbackEventAirbridge, PostbackEventTradingworks, PostbackInstallAirbridge, PostbackInstallTradingworks } from '@entities/Entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Redis } from 'ioredis';

@Injectable()
export class PostbackService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackInstallAirbridge) private readonly postBackInstallAirbridgeRepository: Repository<PostbackInstallAirbridge>,
    @InjectRepository(PostbackEventAirbridge) private readonly postBackEventAirbridgeRepository: Repository<PostbackEventAirbridge>,
    @InjectRepository(PostbackInstallTradingworks) private readonly postbackInstallTradingworksRepository: Repository<PostbackInstallTradingworks>,
    @InjectRepository(PostbackEventTradingworks) private readonly postbackEventTradingworksRepository: Repository<PostbackEventTradingworks>,
  ) {}

  async installAirbridge(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ airbridge ---> mecrosspro ] install : ${originalUrl}`);

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
      originalUrl: request.query.originalUrl,
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
      originalUrl: request.query.originalUrl,
      viewCode: request.query.sub_id,
      token: request.query.custom_param1,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('airbridge:event', date, JSON.stringify(postbackEventAirbridge));
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
      originalUrl: request.query.originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('tradingworks:event', date, JSON.stringify(postbackEventTradingworks));
  }

  async InstallAppsflyer() {}
  async EventAppsflyer() {}

  async InstallAdbrixremaster() {}
  async EventAdbrixremaster() {}

  async InstallAdjust() {}
  async EventAdjust() {}

  async InstallSingular() {}
  async EventSingular() {}
}
