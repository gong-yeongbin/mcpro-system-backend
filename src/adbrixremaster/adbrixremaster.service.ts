import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { PostbackInstallAdbrixremaster, PostbackEventAdbrixremaster } from '../entities/Entity';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class AdbrixremasterService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackInstallAdbrixremaster)
    private readonly postbackInstallAdbrixremasterRepository: Repository<PostbackInstallAdbrixremaster>,
    @InjectRepository(PostbackEventAdbrixremaster)
    private readonly postbackEventAdbrixremasterRepository: Repository<PostbackEventAdbrixremaster>,
  ) {}

  async postbackInstallAdbrixRemaster(request: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] install : ${originalUrl}`);

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

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('adbrixremaster:install', date, JSON.stringify(postbackInstallAdbrixremaster));
    // let cursor: number;
    // cursor = 0;

    // do {
    //   const scanData: [string, string[]] = await redis.hscan('view_code', cursor, 'MATCH', `${postbackInstallAdbrixremaster.token}/*`, 'COUNT', 10000);

    //   cursor = +scanData[0];
    //   const data: string[] = scanData[1];
    //   for (let index = 0; index < data.length; index++) {
    //     if (index % 2 && data[index] == postbackInstallAdbrixremaster.viewCode) {
    //       postbackInstallAdbrixremaster.pubId = data[index - 1].split('/')[1];
    //       postbackInstallAdbrixremaster.subId = data[index - 1].split('/')[2];
    //       cursor = 0;
    //     }
    //   }
    // } while (cursor != 0);

    // return await this.postbackInstallAdbrixremasterRepository.save(postbackInstallAdbrixremaster);
  }

  async postbackEventAdbrixRemaster(request: any): Promise<void> {
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

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('adbrixremaster:event', date, JSON.stringify(postbackEventAdbrixremaster));

    // if (postbackEventAdbrixremaster.paramJson != 'null' && postbackEventAdbrixremaster.paramJson != '') {
    //   const jsonData: any = JSON.parse(postbackEventAdbrixremaster.paramJson);

    //   if (jsonData['abx:item.abx:sales']) {
    //     postbackEventAdbrixremaster.revenue = +jsonData['abx:item.abx:sales'];
    //     postbackEventAdbrixremaster.currency = jsonData['abx:item.abx:currency'];
    //   } else if (jsonData['abx:items']) {
    //     for (const item of jsonData['abx:items']) {
    //       postbackEventAdbrixremaster.revenue += +item['abx:sales'];
    //       postbackEventAdbrixremaster.currency = item['abx:currency'];
    //     }
    //   }
    // }

    // let cursor: number;
    // cursor = 0;

    // do {
    //   const scanData: [string, string[]] = await redis.hscan('view_code', cursor, 'MATCH', `${postbackEventAdbrixremaster.token}/*`, 'COUNT', 10000);

    //   cursor = +scanData[0];
    //   const data: string[] = scanData[1];
    //   for (let index = 0; index < data.length; index++) {
    //     if (index % 2 && data[index] == postbackEventAdbrixremaster.viewCode) {
    //       postbackEventAdbrixremaster.pubId = data[index - 1].split('/')[1];
    //       postbackEventAdbrixremaster.subId = data[index - 1].split('/')[2];
    //       cursor = 0;
    //     }
    //   }
    // } while (cursor != 0);

    // return await this.postbackEventAdbrixremasterRepository.save(postbackEventAdbrixremaster);
  }
}
