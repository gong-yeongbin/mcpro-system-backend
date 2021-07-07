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
    const originalUrl: string = decodeUnicode(
      `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    );

    console.log(`[ appsflyer ---> mecrosspro ] install : ${originalUrl}`);

    const {
      clickid,
      af_siteid,
      af_c_id,
      advertising_id,
      idfa,
      idfv,
      country_code,
      language,
      device_carrier,
      device_ip,
    } = req.query;

    const install_time = moment
      .utc(req.query.install_time)
      .tz('Asia/Seoul')
      .format('YYYY-MM-DD HH:mm:ss');

    const click_time = moment
      .utc(req.query.click_time)
      .tz('Asia/Seoul')
      .format('YYYY-MM-DD HH:mm:ss');

    const postBackDailyEntity: PostBackDaily =
      await this.postBackDailyRepository
        .createQueryBuilder('postBackDaily')
        .leftJoinAndSelect('postBackDaily.campaign', 'campaign')
        .leftJoinAndSelect('campaign.media', 'media')
        .where('postBackDaily.view_code =:view_code', {
          view_code: af_siteid,
        })
        .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: af_c_id })
        .andWhere('Date(postBackDaily.created_at) =:date ', {
          date: moment().tz('Asia/Seoul').format('YYYYMMDD'),
        })
        .getOne();

    if (!postBackDailyEntity) {
      if (!(await this.createPostBackDaily(af_siteid, af_c_id))) {
        throw new NotFoundException();
      }
    }

    const { campaign } = postBackDailyEntity;
    const { media } = campaign;

    const postBackInstallAppsflyer: PostBackInstallAppsflyer =
      new PostBackInstallAppsflyer();

    postBackInstallAppsflyer.view_code = af_siteid;
    postBackInstallAppsflyer.clickid = clickid;
    postBackInstallAppsflyer.af_siteid = af_siteid;
    postBackInstallAppsflyer.af_c_id = af_c_id;
    postBackInstallAppsflyer.advertising_id = advertising_id;
    postBackInstallAppsflyer.idfa = idfa;
    postBackInstallAppsflyer.idfv = idfv;
    postBackInstallAppsflyer.install_time = install_time;
    postBackInstallAppsflyer.country_code = country_code;
    postBackInstallAppsflyer.language = language;
    postBackInstallAppsflyer.click_time = click_time;
    postBackInstallAppsflyer.device_carrier = device_carrier;
    postBackInstallAppsflyer.device_ip = device_ip;
    postBackInstallAppsflyer.originalUrl = originalUrl;
    postBackInstallAppsflyer.campaign = campaign;

    const postBackInstallAppsflyerEntity: PostBackInstallAppsflyer =
      await this.postBackInstallAppsflyerRepository.save(
        postBackInstallAppsflyer,
      );

    postBackDailyEntity.install = +postBackDailyEntity.install + 1;
    await this.postBackDailyRepository.save(postBackDailyEntity);

    if (campaign.status) {
      const convertedPostbackInstallUrlTemplate =
        media.mediaPostbackInstallUrlTemplate
          .replace('{click_id}', clickid)
          .replace('{device_id}', idfa ? idfa : idfa)
          .replace('{android_device_id}', idfa)
          .replace('{ios_device_id}', idfv)
          .replace('{install_timestamp}', install_time);

      const postBackEvent: PostBackEvent =
        await this.postBackEventRepository.findOne({
          where: { campaign: campaign, trackerPostback: 'install' },
        });

      if (postBackEvent.sendPostback) {
        await this.httpService
          .get(convertedPostbackInstallUrlTemplate)
          .toPromise()
          .then(() => {
            console.log(
              `[ mecrosspro ---> media ] install : ${convertedPostbackInstallUrlTemplate}`,
            );
            postBackInstallAppsflyerEntity.send_time = moment
              .utc()
              .tz('Asia/Seoul')
              .format('YYYY-MM-DD HH:mm:ss');
          })
          .catch();

        await this.postBackInstallAppsflyerRepository.save(
          postBackInstallAppsflyerEntity,
        );
      }
    }

    return;
  }

  async postBackEventAppsflyer(req: any) {
    const originalUrl: string = decodeUnicode(
      `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    );

    console.log(`[ appsflyer ---> mecrosspro ] event : ${originalUrl}`);

    const {
      clickid,
      af_siteid,
      af_c_id,
      advertising_id,
      idfa,
      idfv,
      country_code,
      language,
      event_name,
      event_revenue_currency,
      event_revenue,
      device_carrier,
      device_ip,
    } = req.query;

    const install_time = moment
      .utc(req.query.install_time)
      .tz('Asia/Seoul')
      .format('YYYY-MM-DD HH:mm:ss');

    const event_time = moment
      .utc(req.query.event_time)
      .tz('Asia/Seoul')
      .format('YYYY-MM-DD HH:mm:ss');

    let postBackDailyEntity: PostBackDaily = null;

    postBackDailyEntity = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .leftJoinAndSelect('postBackDaily.campaign', 'campaign')
      .leftJoinAndSelect('campaign.advertising', 'advertising')
      .leftJoinAndSelect('campaign.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .where('postBackDaily.view_code =:view_code', {
        view_code: af_siteid,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: af_c_id })
      .andWhere('advertising.status =:status', { status: true })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().tz('Asia/Seoul').format('YYYYMMDD'),
      })
      .getOne();

    if (!postBackDailyEntity) {
      if (!(await this.createPostBackDaily(af_siteid, af_c_id))) {
        throw new NotFoundException();
      }
    }

    const { campaign } = postBackDailyEntity;
    const { media } = campaign;

    const postBackEventAppsflyer: PostBackEventAppsflyer =
      new PostBackEventAppsflyer();

    postBackEventAppsflyer.clickid = clickid;
    postBackEventAppsflyer.view_code = af_siteid;
    postBackEventAppsflyer.af_siteid = af_siteid;
    postBackEventAppsflyer.af_c_id = af_c_id;
    postBackEventAppsflyer.advertising_id = advertising_id;
    postBackEventAppsflyer.idfa = idfa;
    postBackEventAppsflyer.idfv = idfv;
    postBackEventAppsflyer.install_time = install_time;
    postBackEventAppsflyer.country_code = country_code;
    postBackEventAppsflyer.language = language;
    postBackEventAppsflyer.event_name = event_name;
    postBackEventAppsflyer.event_revenue_currency = event_revenue_currency;
    postBackEventAppsflyer.event_revenue = event_revenue;
    postBackEventAppsflyer.event_time = event_time;
    postBackEventAppsflyer.device_carrier = device_carrier;
    postBackEventAppsflyer.device_ip = device_ip;
    postBackEventAppsflyer.originalUrl = originalUrl;
    postBackEventAppsflyer.campaign = campaign;

    const postbackEventApppsflyerEntity: PostBackEventAppsflyer =
      await this.postbackEventAppsflyerRepository.save(postBackEventAppsflyer);

    if (campaign.status) {
      const convertedPostbackEventUrlTemplate =
        media.mediaPostbackEventUrlTemplate
          .replace('{click_id}', clickid)
          .replace('{event_name}', event_name)
          .replace('{event_value}', event_revenue)
          .replace('{device_id}', idfa ? idfa : idfv)
          .replace('{android_device_id}', idfa)
          .replace('{ios_device_id}', idfv)
          .replace('{install_timestamp}', install_time)
          .replace('{event_timestamp}', event_time);

      const postBackEvent: PostBackEvent =
        await this.postBackEventRepository.findOne({
          where: { campaign: campaign, trackerPostback: event_name },
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
              console.log(
                `[ mecrosspro ---> media ] event : ${convertedPostbackEventUrlTemplate}`,
              );
              postbackEventApppsflyerEntity.send_time = moment
                .utc()
                .tz('Asia/Seoul')
                .format('YYYY-MM-DD HH:mm:ss');
            })
            .catch();
          await this.postbackEventAppsflyerRepository.save(
            postbackEventApppsflyerEntity,
          );
        }
      } else {
        const postBackUnregisteredEventEntity: PostBackUnregisteredEvent =
          await this.postBackUnregisteredEventRepository.findOne({
            where: {
              event_name: event_name,
              postBackDaily: postBackDailyEntity,
            },
          });

        if (postBackUnregisteredEventEntity) {
          postBackUnregisteredEventEntity.event_count =
            +postBackUnregisteredEventEntity.event_count + 1;

          await this.postBackUnregisteredEventRepository.save(
            postBackUnregisteredEventEntity,
          );
        } else {
          const postBackUnregisteredEvent: PostBackUnregisteredEvent =
            new PostBackUnregisteredEvent();
          postBackUnregisteredEvent.postBackDaily = postBackDailyEntity;
          postBackUnregisteredEvent.event_name = event_name;

          await this.postBackUnregisteredEventRepository.save(
            postBackUnregisteredEvent,
          );
        }
      }
    }

    return;
  }

  async createPostBackDaily(
    view_code: string,
    cp_token: string,
  ): Promise<boolean> {
    let status: boolean;
    status = false;
    try {
      await this.lockService.lock(
        moment().format('YYYYMMDD'),
        2 * 60 * 1000,
        50,
        50,
      );

      const redis: any = this.redisService.getClient();

      let cursor: number;
      cursor = 0;
      do {
        const data: any = await redis.scan(
          cursor,
          'MATCH',
          `*${cp_token}*`,
          'COUNT',
          1000,
        );

        cursor = data[0];
        const keys: Array<string> = data[1];
        for (let i = 0; i < keys.length; i++) {
          const isViewCode: string = await redis.hget(keys[i], 'view_code');
          if (view_code === isViewCode) {
            const splitData: Array<string> = keys[i].split('/');
            const pub_id: string = splitData[1];
            const sub_id: string = splitData[2];
            const media_idx: string = splitData[3];

            const campaignEntity: Campaign =
              await this.campaignRepository.findOne({
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
