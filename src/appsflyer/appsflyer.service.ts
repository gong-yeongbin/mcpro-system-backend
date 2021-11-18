import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decodeUnicode } from 'src/util';
import { PostbackEventAppsflyer, PostbackInstallAppsflyer } from '../entities/Entity';
import { AppsflyerInstallDto } from './dto/appsflyer-install.dto';
import { RedisService } from 'nestjs-redis';

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
      installTime: query.install_time,
      countryCode: query.country_code,
      language: query.language,
      clickTime: query.click_time,
      deviceCarrier: query.device_carrier,
      deviceIp: query.device_ip,
      originalUrl: originalUrl,
    });

    const redis: any = this.redisService.getClient();

    let cursor: number;
    cursor = 0;

    do {
      const scanData: [string, string[]] = await redis.hscan('view_code', cursor, 'MATCH', `${postbackInstallAppsflyer.token}/*`, 'COUNT', 10000);

      cursor = +scanData[0];
      const data: string[] = scanData[1];
      for (let index = 0; index < data.length; index++) {
        if (index % 2 && data[index] == postbackInstallAppsflyer.viewCode) {
          postbackInstallAppsflyer.pubId = data[index - 1].split('/')[1];
          postbackInstallAppsflyer.subId = data[index - 1].split('/')[2];
          cursor = 0;
        }
      }
    } while (cursor != 0);

    await this.postbackInstallAppsflyerRepository.save(postbackInstallAppsflyer);
    return;
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
      installTime: req.query.install_time,
      countryCode: req.query.country_code,
      language: req.query.language,
      eventName: req.query.event_name,
      eventRevenueCurrency: req.query.event_revenue_currency == 'N/A' ? '' : req.query.event_revenue_currency,
      eventRevenue: req.query.event_revenue == 'N/A' ? 0 : req.query.event_revenue,
      eventTime: req.query.event_time,
      deviceCarrier: req.query.device_carrier,
      deviceIp: req.query.device_ip,
      originalUrl: originalUrl,
    });

    const redis: any = this.redisService.getClient();

    let cursor: number;
    cursor = 0;

    do {
      const scanData: [string, string[]] = await redis.hscan('view_code', cursor, 'MATCH', `${postbackEventAppsflyer.token}/*`, 'COUNT', 10000);

      cursor = +scanData[0];
      const data: string[] = scanData[1];
      for (let index = 0; index < data.length; index++) {
        if (index % 2 && data[index] == postbackEventAppsflyer.viewCode) {
          postbackEventAppsflyer.pubId = data[index - 1].split('/')[1];
          postbackEventAppsflyer.subId = data[index - 1].split('/')[2];
          cursor = 0;
        }
      }
    } while (cursor != 0);

    await this.postbackEventAppsflyerRepository.save(postbackEventAppsflyer);
    return;
  }
}
