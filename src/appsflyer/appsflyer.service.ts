import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decodeUnicode } from 'src/util';
import { PostbackEventAppsflyer, PostbackInstallAppsflyer } from '../entities/Entity';
import { AppsflyerInstallDto } from './dto/appsflyer-install.dto';
import { RedisService } from 'nestjs-redis';
import * as moment from 'moment-timezone';
import { Redis } from 'ioredis';

@Injectable()
export class AppsflyerService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackInstallAppsflyer)
    private readonly postbackInstallAppsflyerRepository: Repository<PostbackInstallAppsflyer>,
    @InjectRepository(PostbackEventAppsflyer)
    private readonly postbackEventAppsflyerRepository: Repository<PostbackEventAppsflyer>,
  ) {}

  async postbackInstallAppsflyer(request: any, query: AppsflyerInstallDto): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ appsflyer ---> mecrosspro ] install : ${originalUrl}`);

    const postbackInstallAppsflyer: PostbackInstallAppsflyer = this.postbackInstallAppsflyerRepository.create({
      viewCode: query.af_siteid,
      token: query.af_c_id,
      clickid: query.clickid,
      afSiteid: query.af_siteid,
      afCId: query.af_c_id,
      advertisingId: query.advertising_id,
      idfa: query.idfa,
      idfv: query.idfv,
      installTime: moment(moment.utc(query.install_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      countryCode: query.country_code,
      language: query.language,
      clickTime: moment(moment.utc(query.click_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      deviceCarrier: query.device_carrier,
      deviceIp: query.device_ip,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('appsflyer:install', date, JSON.stringify(postbackInstallAppsflyer));
  }

  async postbackEventAppsflyer(req: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.headers.host}${req.url}`);
    console.log(`[ appsflyer ---> mecrosspro ] event : ${originalUrl}`);

    const postbackEventAppsflyer: PostbackEventAppsflyer = this.postbackEventAppsflyerRepository.create({
      viewCode: req.query.af_siteid,
      token: req.query.af_c_id,
      clickid: req.query.clickid,
      afSiteid: req.query.af_siteid,
      afCId: req.query.af_c_id,
      advertisingId: req.query.advertising_id,
      idfa: req.query.idfa,
      idfv: req.query.idfv,
      installTime: moment(moment.utc(req.query.install_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      countryCode: req.query.country_code,
      language: req.query.language,
      eventName: req.query.event_name,
      eventRevenueCurrency: req.query.event_revenue_currency == 'N/A' ? '' : req.query.event_revenue_currency,
      eventRevenue: req.query.event_revenue == 'N/A' ? 0 : req.query.event_revenue,
      eventTime: moment(moment.utc(req.query.event_time).toDate()).format('YYYY-MM-DD HH:mm:ss'),
      deviceCarrier: req.query.device_carrier,
      deviceIp: req.query.device_ip,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('appsflyer:event', date, JSON.stringify(postbackEventAppsflyer));
  }
}
