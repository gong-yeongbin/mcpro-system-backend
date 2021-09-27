import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from 'nestjs-redis';
import { Campaign } from '../entities/Entity';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { decodeUnicode } from 'src/util';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    private readonly redisService: RedisService,
  ) {}

  async tracking(request: any): Promise<string> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ media ---> mecrosspro ] ${originalUrl}`);

    const token: string = ['', undefined, '{token}'].includes(request.query.token) ? '' : request.query.token;
    const pubId: string = ['', undefined, '{pub_id}'].includes(request.query.pub_id) ? '' : request.query.pub_id;
    const subId: string = ['', undefined, '{sub_id}'].includes(request.query.sub_id) ? '' : request.query.sub_id;

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: {
        token: token,
        status: true,
      },
      relations: ['media', 'advertising', 'advertising.tracker'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const todayDate: string = moment().tz('Asia/Seoul').format('YYYYMMDD');
    const redisKey: string = `${token}/${pubId}/${subId}/${campaignEntity.media.idx}` as string;

    const redis: any = this.redisService.getClient();

    const isClickValidation: number = await redis.hget(todayDate, redisKey);

    !isClickValidation ? await redis.hset(todayDate, redisKey, 1) : await redis.hincrby(todayDate, redisKey, 1);

    let viewCode: string = await redis.hget('view_code', redisKey);

    if (!viewCode) {
      viewCode = v4().replace(/-/g, '');
      await redis.hset('view_code', redisKey, viewCode);
    }

    return await convertTrackerTrackingUrl(campaignEntity, request.query, viewCode);
  }
}

async function convertTrackerTrackingUrl(campaign: Campaign, query: any, viewCode: string): Promise<string> {
  const token: string = ['', undefined, '{token}'].includes(query.token) ? '' : query.token;
  const uuid: string = ['', undefined, '{uuid}'].includes(query.uuid) ? '' : query.uuid;
  const adid: string = ['', undefined, '{adid}'].includes(query.adid) ? '' : query.adid; // android device id
  const idfa: string = ['', undefined, '{idfa}'].includes(query.idfa) ? '' : query.idfa; // ios device id
  const clickId: string = ['', undefined, '{click_id}'].includes(query.click_id) ? '' : query.click_id;
  const tracker: string = campaign.advertising.tracker.name;
  const trackerTrackingUrl: string = campaign.trackerTrackingUrl;
  const deviceId: string = adid ? adid : idfa;

  let convertedTrackerTrackingUrl: string = null;

  switch (tracker) {
    case 'appsflyer':
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace('{clickid}', clickId) //click id
        .replace('{af_siteid}', viewCode) //view code
        .replace('{af_c_id}', token) //campaign token
        .replace('{advertising_id}', adid) //android device id
        .replace('{idfa}', idfa) //ios device id
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
        .replace('{cb_1}', token) //campaign code
        .replace('{cb_2}', viewCode) //view code
        .replace('{cb_3}', clickId) //click id
        .replace('{cb_4}', '')
        .replace('{cb_5}', '');

      break;
  }

  return !uuid ? convertedTrackerTrackingUrl : convertedTrackerTrackingUrl + `&uuid=${uuid}`;
}
