import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { Campaign } from '../entities/Entity';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { decodeUnicode } from 'src/util';
import { TrackingDto } from './dto/tracking.dto';

@Injectable()
export class TrackingService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async tracking(request: any, query: TrackingDto): Promise<string> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ media ---> mecrosspro ] ${originalUrl}`);

    const todayDate: string = moment().tz('Asia/Seoul').format('YYYYMMDD');

    query.token = ['', undefined, '{token}'].includes(query.token) ? '' : query.token;
    query.click_id = ['', undefined, '{click_id}'].includes(query.click_id) ? '' : query.click_id;
    query.pub_id = ['', undefined, '{pub_id}'].includes(query.pub_id) ? '' : query.pub_id;
    query.sub_id = ['', undefined, '{sub_id}'].includes(query.sub_id) ? '' : query.sub_id;
    query.adid = ['', undefined, '{adid}'].includes(query.adid) ? '' : query.adid;
    query.idfa = ['', undefined, '{idfa}'].includes(query.idfa) ? '' : query.idfa;
    query.uuid = ['', undefined, '{uuid}'].includes(query.uuid) ? '' : query.uuid;

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: {
        token: query.token,
        status: true,
      },
      relations: ['media', 'advertising', 'advertising.tracker'],
    });

    const redis: Redis = this.redisService.getClient();
    const redisKey: string = `${query.token}/${query.pub_id}/${query.sub_id}/${campaignEntity.media.idx}` as string;

    const isClickValidation: number = +(await redis.hget(todayDate, redisKey));

    !!!isClickValidation ? await redis.hset(todayDate, redisKey, 1) : await redis.hincrby(todayDate, redisKey, 1);

    let viewCode: string = await redis.hget('view_code', redisKey);
    if (!viewCode) viewCode = await this.isCreateViewCode(redis, redisKey);

    return await this.convertTrackerTrackingUrl(campaignEntity, query, viewCode);
  }

  async isCreateViewCode(redis: Redis, redisKey: string): Promise<string> {
    const viewCode = v4().replace(/-/g, '');
    await redis.hset('view_code', redisKey, viewCode);
    return viewCode;
  }

  async convertTrackerTrackingUrl(campaign: Campaign, query: TrackingDto, viewCode: string): Promise<string> {
    const tracker: string = campaign.advertising.tracker.name;
    const trackerTrackingUrl: string = campaign.trackerTrackingUrl;
    const deviceId: string = query.adid ? query.adid : query.idfa;

    let convertedTrackerTrackingUrl: string = null;

    switch (tracker) {
      case 'appsflyer':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace('{clickid}', query.click_id) //click id
          .replace('{af_siteid}', viewCode) //view code
          .replace('{af_c_id}', query.token) //campaign token
          .replace('{advertising_id}', query.adid) //android device id
          .replace('{idfa}', query.idfa) //ios device id
          .replace('{af_adset_id}', '')
          .replace('{af_ad_id}', '')
          .replace('{af_ip}', '') //device ip
          .replace('{af_ua}', '') //user agent
          .replace('{af_lang}', ''); //device language
        break;
      case 'adbrixremaster':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace('{m_adid}', deviceId) //device id
          .replace('{m_publisher}', viewCode) //view code
          .replace('{m_sub_publisher}', '') //view code
          .replace('{cb_1}', query.token) //campaign code
          .replace('{cb_2}', viewCode) //view code
          .replace('{cb_3}', query.click_id) //click id
          .replace('{cb_4}', '')
          .replace('{cb_5}', '');

        break;
    }

    return !query.uuid ? convertedTrackerTrackingUrl : convertedTrackerTrackingUrl + `&uuid=${query.uuid}`;
  }
}
