import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import * as moment from 'moment';
import { RedisService } from 'nestjs-redis';
import { RedisLockService } from 'nestjs-simple-redis-lock';
import { decodeUnicode } from 'src/util';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    private readonly redisService: RedisService,
    private readonly lockService: RedisLockService,
  ) {}

  async tracking(request: any): Promise<string> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.get('host')}${request.originalUrl}`);

    const cp_token: string = ['', undefined, '{token}'].includes(request.query.token) ? '' : request.query.token;
    const pub_id: string = ['', undefined, '{pub_id}'].includes(request.query.pub_id) ? '' : request.query.pub_id;
    const sub_id: string = ['', undefined, '{sub_id}'].includes(request.query.sub_id) ? '' : request.query.sub_id;

    console.log(`[ media ---> mecrosspro ] ${originalUrl}`);

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: {
        cp_token: cp_token,
        status: true,
      },
      relations: ['media', 'advertising', 'advertising.tracker'],
    });

    if (!campaignEntity) throw new NotFoundException();

    try {
      await this.lockService.lock(moment().format('YYYYMMDD'), 2 * 60 * 1000, 50, 50);

      let view_code: string;
      const redis: any = this.redisService.getClient();

      const oldAndnew: any = await redis.hgetall(`${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`);
      console.log('🚀 ~ file: tracking.service.ts ~ line 46 ~ TrackingService ~ tracking ~ oldAndnew', oldAndnew);
      console.log('🚀 ~ file: tracking.service.ts ~ line 46 ~ TrackingService ~ tracking ~ oldAndnew', !oldAndnew);
      console.log('🚀 ~ file: tracking.service.ts ~ line 46 ~ TrackingService ~ tracking ~ oldAndnew', !!oldAndnew);

      if (!!oldAndnew) {
        view_code = await redis.hget('view_code', `${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`);

        if (!view_code || typeof view_code != 'string') {
          view_code = v4().replace(/-/g, '');

          await redis.hset('view_code', `${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`, view_code);
          await redis.hsetnx(`${moment().tz('Asia/Seoul').format('YYYYMMDD')}`, `${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`, 1);
        } else {
          await redis.hincrby(`${moment().tz('Asia/Seoul').format('YYYYMMDD')}`, `${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`, 1);
        }
      } else {
        view_code = oldAndnew.view_code;

        await redis.hset('view_code', `${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`, view_code);
        const isExists: number = await redis.hsetnx(
          `${moment().tz('Asia/Seoul').format('YYYYMMDD')}`,
          `${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`,
          1,
        );

        if (!isExists) {
          await redis.hincrby(`${moment().tz('Asia/Seoul').format('YYYYMMDD')}`, `${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`, 1);
        }

        // const isExists: number = await redis.hsetnx(
        //   `${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`,
        //   `${moment().tz('Asia/Seoul').format('YYYYMMDD')}:click`,
        //   1,
        // );
        // if (!isExists) {
        //   await redis.hincrby(`${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`, `${moment().tz('Asia/Seoul').format('YYYYMMDD')}:click`, 1);
        // }
        // view_code = await redis.hget(`${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`, 'view_code');
        // if (!view_code) {
        //   view_code = v4().replace(/-/g, '');
        //   await redis.hmset(`${cp_token}/${pub_id}/${sub_id}/${campaignEntity.media.idx}`, 'view_code', `${view_code}`);
        // }
      }

      const convertedTrackingUrl: string = convertTrackerTrackingUrl(
        campaignEntity.advertising.tracker.tk_code,
        campaignEntity.trackerTrackingUrl,
        request.query,
        view_code,
      );

      return convertedTrackingUrl;
    } finally {
      this.lockService.unlock(moment().format('YYYYMMDD'));
    }
  }
}

function convertTrackerTrackingUrl(tk_code: string, trackerTrackingUrl: string, query: any, view_code: string) {
  const android_device_id = query.adid === '{adid}' ? '' : query.adid;
  const ios_device_id = query.idfa === '{idfa}' ? '' : query.idfa;
  const device_id: string = android_device_id ? android_device_id : ios_device_id;

  let convertedTrackerTrackingUrl: string = null;

  switch (tk_code) {
    case 'appsflyer':
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace(
          '{clickid}', //click id
          query.click_id,
        )
        .replace(
          '{af_siteid}', //view code
          view_code,
        )
        .replace(
          '{af_c_id}', //campaign token
          query.token,
        )
        .replace(
          '{advertising_id}', //android device id
          android_device_id,
        )
        .replace(
          '{idfa}', //ios device id
          ios_device_id,
        )
        .replace('{af_adset_id}', '')
        .replace('{af_ad_id}', '')
        .replace('{af_ip}', '') //device ip
        .replace('{af_ua}', '') //user agent
        .replace('{af_lang}', ''); //device language
      break;
    case 'adbrixremaster':
      convertedTrackerTrackingUrl = trackerTrackingUrl
        .replace(
          '{m_adid}', //device id
          device_id,
        )
        .replace('{m_publisher}', view_code) //view code
        .replace(
          '{cb_1}', //campaign code
          query.token,
        )
        .replace(
          '{cb_2}', //click id
          query.click_id,
        )
        .replace('{cb_3}', '')
        .replace('{cb_4}', '')
        .replace('{cb_5}', '');

      break;
  }

  return convertedTrackerTrackingUrl;
}
