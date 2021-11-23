import { PostbackEventAdjust, PostbackInstallAdjust } from '@entities/Entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';

@Injectable()
export class AdjustService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackInstallAdjust)
    private readonly postbackInstallAdjustRepository: Repository<PostbackInstallAdjust>,
    @InjectRepository(PostbackEventAdjust)
    private readonly postbackEventAdjustRepository: Repository<PostbackEventAdjust>,
  ) {}

  async postbackInstall(request: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] install : ${originalUrl}`);

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

    const redis: any = this.redisService.getClient();

    let cursor: number;
    cursor = 0;

    do {
      const scanData: [string, string[]] = await redis.hscan('view_code', cursor, 'MATCH', `${postbackInstallAdjust.token}/*`, 'COUNT', 10000);

      cursor = +scanData[0];
      const data: string[] = scanData[1];
      for (let index = 0; index < data.length; index++) {
        if (index % 2 && data[index] == postbackInstallAdjust.viewCode) {
          postbackInstallAdjust.pubId = data[index - 1].split('/')[1];
          postbackInstallAdjust.subId = data[index - 1].split('/')[2];
          cursor = 0;
        }
      }
    } while (cursor != 0);

    await this.postbackInstallAdjustRepository.save(postbackInstallAdjust);
  }

  async postbackEvent(request: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] event : ${originalUrl}`);

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

    const redis: any = this.redisService.getClient();

    let cursor: number;
    cursor = 0;

    do {
      const scanData: [string, string[]] = await redis.hscan('view_code', cursor, 'MATCH', `${postbackEventAdjust.token}/*`, 'COUNT', 10000);

      cursor = +scanData[0];
      const data: string[] = scanData[1];
      for (let index = 0; index < data.length; index++) {
        if (index % 2 && data[index] == postbackEventAdjust.viewCode) {
          postbackEventAdjust.pubId = data[index - 1].split('/')[1];
          postbackEventAdjust.subId = data[index - 1].split('/')[2];
          cursor = 0;
        }
      }
    } while (cursor != 0);

    await this.postbackEventAdjustRepository.save(postbackEventAdjust);
  }
}
