import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { decodeUnicode } from 'src/util';
import { TrackingDto } from './dto/tracking.dto';
import { Campaign as Campaign1 } from '../entities/Entity';
import { InjectModel } from '@nestjs/mongoose';
import { ImpressionCode, ImpressionCodeDocument } from 'src/schema/impressionCode';
import { Model } from 'mongoose';
import { Campaign, CampaignDocument } from 'src/schema/campaign';

@Injectable()
export class TrackingService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Campaign1)
    private readonly campaignRepository: Repository<Campaign1>,
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(ImpressionCode.name) private impressionCodeModel: Model<ImpressionCodeDocument>,
  ) {}
  async tracking(request: any, query: TrackingDto): Promise<string> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ media ---> mecrosspro ] ${originalUrl}`);

    const token: string = query.token;
    const click_id: string = query.click_id;
    const pub_id: string = query.pub_id;
    const sub_id: string = query.sub_id;
    const adid: string = query.adid;
    const idfa: string = query.idfa;
    const uuid: string = query.uuid;

    const todayDate: string = moment().tz('Asia/Seoul').format('YYYYMMDD');

    const redis: Redis = this.redisService.getClient();

    let redisData: any;
    // eslint-disable-next-line prefer-const
    redisData = await redis.hgetall(token);

    if (!Object.keys(redisData).length) {
      const campaignEntity: Campaign1 = await this.campaignRepository.findOne({
        where: {
          token: token,
          status: true,
        },
      });

      if (!campaignEntity) throw new NotFoundException();
      if (campaignEntity.block) return;

      redisData['trackerTrackingUrl'] = campaignEntity.trackerTrackingUrl;

      await redis.hset(token, 'tracker', redisData.tracker, 'trackerTrackingUrl', redisData.trackerTrackingUrl);
      await redis.expire(token, 60 * 60);
    }

    const redisKey: string = `${token}/${pub_id}/${sub_id}` as string;

    const isClickValidation: number = +(await redis.hget(todayDate, redisKey));

    !!!isClickValidation ? await redis.hset(todayDate, redisKey, 1) : await redis.hincrby(todayDate, redisKey, 1);

    let viewCode: string = await redis.hget('view_code', redisKey);
    if (!viewCode) viewCode = await this.isCreateViewCode(redis, redisKey);

    await this.impressionCodeModel.findOneAndUpdate(
      { token: token, pub_id: pub_id, sub_id: sub_id },
      { $set: { token: token, impressionCode: viewCode, pub_id: pub_id, sub_id: sub_id, updatedAt: Date.now() } },
      { upsert: true },
    );

    // return await this.convertTrackerTrackingUrl(redisData, query, viewCode);
    return (
      redisData.trackerTrackingUrl
        .replace(/{clickid}/gi, click_id)
        .replace(/{af_siteid}/gi, viewCode)
        .replace(/{af_c_id}/gi, token)
        .replace(/{advertising_id}/gi, adid)
        .replace(/{idfa}/gi, idfa)
        .replace(/{m_adid}/gi, adid ? adid : idfa)
        .replace(/{m_publisher}/gi, viewCode)
        .replace(/{cb_1}/gi, token)
        .replace(/{cb_2}/gi, viewCode)
        .replace(/{cb_3}/gi, click_id)
        .replace(/{cb_5}/gi, uuid)
        .replace(/{adid}/gi, adid)
        .replace(/{publisher_id}/gi, viewCode)
        .replace(/{cp_token}/gi, token)
        .replace(/{click_id}/gi, click_id)
        .replace(/{gaid}/gi, adid)
        .replace(/{token}/gi, token)
        .replace(/{view_code}/gi, viewCode)
        .replace(/{psid}/gi, viewCode)
        .replace(/{sub3}/gi, click_id)
        .replace(/{transaction_id}/gi, click_id)
        .replace(/{cb_param1}/gi, token)
        .replace(/{custom_param1}/gi, token)
        .replace(/{view_code}}/gi, viewCode)
        .replace(/{ifa}/gi, idfa) + `&uuid=${uuid}`
    );
  }

  async isCreateViewCode(redis: Redis, redisKey: string): Promise<string> {
    const viewCode = v4().replace(/-/g, '');
    await redis.hset('view_code', redisKey, viewCode);
    return viewCode;
  }

  async convertTrackerTrackingUrl(redisData: any, query: TrackingDto, viewCode: string): Promise<string> {
    const tracker: string = redisData.tracker;
    const trackerTrackingUrl: string = redisData.trackerTrackingUrl;
    const adid: string = query.adid;
    const idfa: string = query.idfa;
    const deviceId: string = query.adid ? query.adid : query.idfa;

    let convertedTrackerTrackingUrl: string = null;

    switch (tracker) {
      case 'appsflyer':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace('{clickid}', query.click_id) //click id
          .replace('{af_siteid}', viewCode) //view code
          .replace('{af_c_id}', query.token) //campaign token
          .replace('{advertising_id}', query.adid) //android device id
          .replace('{idfa}', query.idfa); //ios device id
        // .replace('{af_adset_id}', '')
        // .replace('{af_ad_id}', '')
        // .replace('{af_ip}', '') //device ip
        // .replace('{af_ua}', '') //user agent
        // .replace('{af_lang}', ''); //device language
        break;
      case 'adbrixremaster':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace('{m_adid}', deviceId) //device id
          .replace('{m_publisher}', viewCode) //view code
          // .replace('{m_sub_publisher}', '') //view code
          .replace('{cb_1}', query.token) //campaign code
          .replace('{cb_2}', viewCode) //view code
          .replace('{cb_3}', query.click_id) //click id
          // .replace('{cb_4}', '')
          .replace('{cb_5}', query.uuid);
        break;
      case 'adjust':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace(/{adid}/gi, adid) //view code
          .replace(/{idfa}/gi, idfa) //view code
          .replace(/{publisher_id}/gi, viewCode) //view code
          .replace(/{cp_token}/gi, query.token) //campaign code
          .replace(/{click_id}/gi, query.click_id); //click id
        // .replace(/{uid}/gi, '');
        break;
      case 'singular':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace(/{idfa}/gi, idfa)
          .replace(/{gaid}/gi, adid)
          .replace(/{campaignName}/gi, '')
          .replace(/{campaignId}/gi, '')
          .replace(/{click_id}/gi, query.click_id) //click id
          .replace(/{token}/gi, query.token) //view code
          .replace(/{view_code}/gi, viewCode) //campaign code
          .replace(/{psid}/gi, viewCode) //campaign code
          .replace(/{sub3}/gi, query.click_id)
          .replace(/{sub4}/gi, '')
          .replace(/{sub5}/gi, '');
        break;
      case 'tradingworks':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace(/{transaction_id}/gi, query.click_id)
          .replace(/{publisher_id}/gi, viewCode)
          .replace(/{idfa}/gi, idfa)
          .replace(/{adid}/gi, adid)
          .replace(/{cb_param1}/gi, query.token)
          .replace(/{cb_param2}/gi, '');
        break;
      case 'airbridge':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace(/{click_id}/gi, query.click_id)
          .replace(/{publisher_id}/gi, viewCode)
          .replace(/{gaid}/gi, adid)
          .replace(/{idfa}/gi, idfa)
          .replace(/{custom_param1}/gi, query.token)
          .replace(/{custom_param2}/gi, '')
          .replace(/{custom_param3}/gi, '')
          .replace(/{custom_param4}/gi, '')
          .replace(/{custom_param5}/gi, '');
        break;
      case 'mobiconnect':
        convertedTrackerTrackingUrl = trackerTrackingUrl
          .replace(/{click_id}/gi, query.click_id)
          .replace(/{view_code}}/gi, viewCode)
          .replace(/{pub_sub_id2}}/gi, '')
          .replace(/{gaid}/gi, adid)
          .replace(/{ifa}/gi, idfa)
          .replace(/{token}/gi, query.token)
          .replace(/{custom_id2}/gi, '')
          .replace(/{custom_id3}/gi, '');

        break;
    }

    return !query.uuid ? convertedTrackerTrackingUrl : convertedTrackerTrackingUrl + `&uuid=${query.uuid}`;
  }
}
