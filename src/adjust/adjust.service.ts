import { PostbackEventAdjust, PostbackInstallAdjust } from '@entities/Entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Redis } from 'ioredis';

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
    console.log(`[ adjust ---> mecrosspro ] install : ${originalUrl}`);

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
    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('adjust:install', date, JSON.stringify(postbackInstallAdjust));
  }

  async postbackEvent(request: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adjust ---> mecrosspro ] event : ${originalUrl}`);

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

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('adjust:event', date, JSON.stringify(postbackEventAdjust));
  }
}
