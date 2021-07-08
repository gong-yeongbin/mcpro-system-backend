/* eslint-disable prefer-const */
import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostBackDaily } from 'src/entities/PostBackDaily';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { PostBackEvent } from 'src/entities/PostBackEvent';
import { PostBackEventAppsflyer } from 'src/entities/PostBackEventAppsflyer';
import { PostBackInstallAppsflyer } from 'src/entities/PostBackInstallAppsflyer';
import { PostBackUnregisteredEvent } from 'src/entities/PostBackUnregisteredEvent';
import { RedisService } from 'nestjs-redis';
import { RedisLockService } from 'nestjs-simple-redis-lock';
import { decodeUnicode } from 'src/common/util';
import { Campaign } from 'src/entities/Campaign';
import { AppsflyerInstall } from './dto/appsflyer-install';
import { AppsflyerEvent } from './dto/appsflyer-event';

@Injectable()
export class PostbackService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostBackDaily)
    private readonly postBackDailyRepository: Repository<PostBackDaily>,
    @InjectRepository(PostBackEvent)
    private readonly postBackEventRepository: Repository<PostBackEvent>,
    @InjectRepository(PostBackUnregisteredEvent)
    private readonly postBackUnregisteredEventRepository: Repository<PostBackUnregisteredEvent>,
    @InjectRepository(PostBackInstallAppsflyer)
    private readonly postBackInstallAppsflyerRepository: Repository<PostBackInstallAppsflyer>,
    @InjectRepository(PostBackEventAppsflyer)
    private readonly postbackEventAppsflyerRepository: Repository<PostBackEventAppsflyer>,
    private readonly redisService: RedisService,
    private readonly lockService: RedisLockService,
  ) {}

  async postBackInstallAppsflyer(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    console.log(`[ appsflyer ---> mecrosspro ] install : ${originalUrl}`);

    const appsflyer = new AppsflyerInstall(req.query).build();

    const postBackDailyEntity: PostBackDaily = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .leftJoinAndSelect('postBackDaily.campaign', 'campaign')
      .leftJoinAndSelect('campaign.media', 'media')
      .where('postBackDaily.view_code =:view_code', {
        view_code: appsflyer.af_siteid,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: appsflyer.af_c_id })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().tz('Asia/Seoul').format('YYYYMMDD'),
      })
      .getOne();

    if (!postBackDailyEntity) {
      if (!(await this.createPostBackDaily(appsflyer.af_siteid, appsflyer.af_c_id))) {
        throw new NotFoundException();
      }
    }

    const { campaign } = postBackDailyEntity;
    const { media } = campaign;

    const postBackInstallAppsflyer: PostBackInstallAppsflyer = new PostBackInstallAppsflyer();

    postBackInstallAppsflyer.view_code = appsflyer.af_siteid;
    postBackInstallAppsflyer.clickid = appsflyer.clickid;
    postBackInstallAppsflyer.af_siteid = appsflyer.af_siteid;
    postBackInstallAppsflyer.af_c_id = appsflyer.af_c_id;
    postBackInstallAppsflyer.advertising_id = appsflyer.advertising_id;
    postBackInstallAppsflyer.idfa = appsflyer.idfa;
    postBackInstallAppsflyer.idfv = appsflyer.idfv;
    postBackInstallAppsflyer.install_time = appsflyer.install_time;
    postBackInstallAppsflyer.country_code = appsflyer.country_code;
    postBackInstallAppsflyer.language = appsflyer.language;
    postBackInstallAppsflyer.click_time = appsflyer.click_time;
    postBackInstallAppsflyer.device_carrier = appsflyer.device_carrier;
    postBackInstallAppsflyer.device_ip = appsflyer.device_ip;
    postBackInstallAppsflyer.originalUrl = originalUrl;
    postBackInstallAppsflyer.campaign = campaign;

    const postBackInstallAppsflyerEntity: PostBackInstallAppsflyer = await this.postBackInstallAppsflyerRepository.save(
      postBackInstallAppsflyer,
    );

    postBackDailyEntity.install = +postBackDailyEntity.install + 1;
    await this.postBackDailyRepository.save(postBackDailyEntity);

    if (campaign.status) {
      const convertedPostbackInstallUrlTemplate = media.mediaPostbackInstallUrlTemplate
        .replace('{click_id}', appsflyer.clickid)
        .replace('{device_id}', appsflyer.idfa ? appsflyer.idfa : appsflyer.idfv)
        .replace('{android_device_id}', appsflyer.idfa)
        .replace('{ios_device_id}', appsflyer.idfv)
        .replace('{install_timestamp}', appsflyer.install_time);

      const postBackEvent: PostBackEvent = await this.postBackEventRepository.findOne({
        where: { campaign: campaign, trackerPostback: 'install' },
      });

      if (postBackEvent.sendPostback) {
        await this.httpService
          .get(convertedPostbackInstallUrlTemplate)
          .toPromise()
          .then(() => {
            console.log(`[ mecrosspro ---> media ] install : ${convertedPostbackInstallUrlTemplate}`);
            postBackInstallAppsflyerEntity.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
          })
          .catch();

        await this.postBackInstallAppsflyerRepository.save(postBackInstallAppsflyerEntity);
      }
    }

    return;
  }

  async postBackEventAppsflyer(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    console.log(`[ appsflyer ---> mecrosspro ] event : ${originalUrl}`);

    const appsflyer = new AppsflyerEvent(req.query).build();

    let postBackDailyEntity: PostBackDaily = null;

    postBackDailyEntity = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .leftJoinAndSelect('postBackDaily.campaign', 'campaign')
      .leftJoinAndSelect('campaign.advertising', 'advertising')
      .leftJoinAndSelect('campaign.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .where('postBackDaily.view_code =:view_code', {
        view_code: appsflyer.af_siteid,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: appsflyer.af_c_id })
      .andWhere('advertising.status =:status', { status: true })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().tz('Asia/Seoul').format('YYYYMMDD'),
      })
      .getOne();

    if (!postBackDailyEntity) {
      if (!(await this.createPostBackDaily(appsflyer.af_siteid, appsflyer.af_c_id))) {
        throw new NotFoundException();
      }
    }

    const { campaign } = postBackDailyEntity;
    const { media } = campaign;

    const postBackEventAppsflyer: PostBackEventAppsflyer = new PostBackEventAppsflyer();

    postBackEventAppsflyer.clickid = appsflyer.clickid;
    postBackEventAppsflyer.view_code = appsflyer.af_siteid;
    postBackEventAppsflyer.af_siteid = appsflyer.af_siteid;
    postBackEventAppsflyer.af_c_id = appsflyer.af_c_id;
    postBackEventAppsflyer.advertising_id = appsflyer.advertising_id;
    postBackEventAppsflyer.idfa = appsflyer.idfa;
    postBackEventAppsflyer.idfv = appsflyer.idfv;
    postBackEventAppsflyer.install_time = appsflyer.install_time;
    postBackEventAppsflyer.country_code = appsflyer.country_code;
    postBackEventAppsflyer.language = appsflyer.language;
    postBackEventAppsflyer.event_name = appsflyer.event_name;
    postBackEventAppsflyer.event_revenue_currency = appsflyer.event_revenue_currency;
    postBackEventAppsflyer.event_revenue = appsflyer.event_revenue;
    postBackEventAppsflyer.event_time = appsflyer.event_time;
    postBackEventAppsflyer.device_carrier = appsflyer.device_carrier;
    postBackEventAppsflyer.device_ip = appsflyer.device_ip;
    postBackEventAppsflyer.originalUrl = originalUrl;
    postBackEventAppsflyer.campaign = campaign;

    const postbackEventApppsflyerEntity: PostBackEventAppsflyer = await this.postbackEventAppsflyerRepository.save(
      postBackEventAppsflyer,
    );

    if (campaign.status) {
      const convertedPostbackEventUrlTemplate = media.mediaPostbackEventUrlTemplate
        .replace('{click_id}', appsflyer.clickid)
        .replace('{event_name}', appsflyer.event_name)
        .replace('{event_value}', appsflyer.event_revenue)
        .replace('{device_id}', appsflyer.idfa ? appsflyer.idfa : appsflyer.idfv)
        .replace('{android_device_id}', appsflyer.idfa)
        .replace('{ios_device_id}', appsflyer.idfv)
        .replace('{install_timestamp}', appsflyer.install_time)
        .replace('{event_timestamp}', appsflyer.event_time);

      const postBackEvent: PostBackEvent = await this.postBackEventRepository.findOne({
        where: { campaign: campaign, trackerPostback: appsflyer.event_name },
      });

      if (postBackEvent) {
        switch (postBackEvent.adminPostback) {
          case 'install':
            postBackDailyEntity.install = +postBackDailyEntity.install + 1;
            break;
          case 'signup':
            postBackDailyEntity.signup = +postBackDailyEntity.signup + 1;
            break;
          case 'retention':
            postBackDailyEntity.retention = +postBackDailyEntity.retention + 1;
            break;
          case 'buy':
            postBackDailyEntity.buy = +postBackDailyEntity.buy + 1;
            break;
          case 'etc1':
            postBackDailyEntity.etc1 = +postBackDailyEntity.etc1 + 1;
            break;
          case 'etc2':
            postBackDailyEntity.etc2 = +postBackDailyEntity.etc2 + 1;
            break;
          case 'etc3':
            postBackDailyEntity.etc3 = +postBackDailyEntity.etc3 + 1;
            break;
          case 'etc4':
            postBackDailyEntity.etc4 = +postBackDailyEntity.etc4 + 1;
            break;
          case 'etc5':
            postBackDailyEntity.etc5 = +postBackDailyEntity.etc5 + 1;
            break;
        }

        await this.postBackDailyRepository.save(postBackDailyEntity);

        if (postBackEvent.sendPostback) {
          await this.httpService
            .get(convertedPostbackEventUrlTemplate)
            .toPromise()
            .then(() => {
              console.log(`[ mecrosspro ---> media ] event : ${convertedPostbackEventUrlTemplate}`);
              postbackEventApppsflyerEntity.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
            })
            .catch();
          await this.postbackEventAppsflyerRepository.save(postbackEventApppsflyerEntity);
        }
      } else {
        const postBackUnregisteredEventEntity: PostBackUnregisteredEvent =
          await this.postBackUnregisteredEventRepository.findOne({
            where: {
              event_name: appsflyer.event_name,
              postBackDaily: postBackDailyEntity,
            },
          });

        if (postBackUnregisteredEventEntity) {
          postBackUnregisteredEventEntity.event_count = +postBackUnregisteredEventEntity.event_count + 1;

          await this.postBackUnregisteredEventRepository.save(postBackUnregisteredEventEntity);
        } else {
          const postBackUnregisteredEvent: PostBackUnregisteredEvent = new PostBackUnregisteredEvent();
          postBackUnregisteredEvent.postBackDaily = postBackDailyEntity;
          postBackUnregisteredEvent.event_name = appsflyer.event_name;

          await this.postBackUnregisteredEventRepository.save(postBackUnregisteredEvent);
        }
      }
    }

    return;
  }

  async createPostBackDaily(view_code: string, cp_token: string): Promise<boolean> {
    let status: boolean;
    status = false;
    try {
      await this.lockService.lock(moment().format('YYYYMMDD'), 2 * 60 * 1000, 50, 50);

      const redis: any = this.redisService.getClient();

      let cursor: number;
      cursor = 0;
      do {
        const data: any = await redis.scan(cursor, 'MATCH', `*${cp_token}*`, 'COUNT', 1000);

        cursor = data[0];
        const keys: Array<string> = data[1];
        for (let i = 0; i < keys.length; i++) {
          const isViewCode: string = await redis.hget(keys[i], 'view_code');
          if (view_code === isViewCode) {
            const splitData: Array<string> = keys[i].split('/');
            const pub_id: string = splitData[1];
            const sub_id: string = splitData[2];
            const media_idx: string = splitData[3];

            const campaignEntity: Campaign = await this.campaignRepository.findOne({
              where: {
                cp_token: cp_token,
                media: { idx: media_idx },
              },
              relations: ['media'],
            });

            if (!campaignEntity) {
              throw new NotFoundException();
            }

            const postBackDaily: PostBackDaily = new PostBackDaily();
            postBackDaily.cp_token = cp_token;
            postBackDaily.pub_id = pub_id;
            postBackDaily.sub_id = sub_id;
            postBackDaily.view_code = view_code;
            postBackDaily.campaign = campaignEntity;

            await this.postBackDailyRepository.save(postBackDaily);
            status = true;
          }
        }
      } while (cursor != 0);
    } finally {
      this.lockService.unlock(moment().format('YYYYMMDD'));
    }
    return status;
  }
}
