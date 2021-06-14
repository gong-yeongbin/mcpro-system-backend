import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostBackDaily } from 'src/entities/PostBackDaily';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { PostBackEvent } from 'src/entities/PostBackEvent';
import {
  PostBackEventAppsflyer,
  PostBackEventAppsflyerMetaData,
} from 'src/entities/PostBackEventAppsflyer';
import {
  PostBackInstallAppsflyer,
  PostBackInstallAppsflyerMetaData,
} from 'src/entities/PostBackInstallAppsflyer';
import {
  PostBackUnregisteredEvent,
  PostBackUnregisteredEventMetaData,
} from 'src/entities/PostBackUnregisteredEvent';
import { decodeUnicode } from 'src/common/util';

@Injectable()
export class PostbackService {
  constructor(
    private httpService: HttpService,
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
      install_time,
      country_code,
      language,
      click_time,
      device_carrier,
      device_ip,
    } = req.query;

    console.log(
      `[ appsflyer ---> mecrosspro ] cp_token:${af_c_id}, view_code:${af_siteid}, click_id:${clickid}`,
    );

    const postBackDaily: PostBackDaily = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .leftJoinAndSelect('postBackDaily.campaign', 'campaign')
      .leftJoinAndSelect('campaign.advertising', 'advertising')
      .leftJoinAndSelect('campaign.media', 'media')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .where('postBackDaily.view_code =:view_code', {
        view_code: af_siteid,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: af_c_id })
      .andWhere('postBackEvent.trackerPostBack =:trackerPostBack', {
        trackerPostBack: 'install',
      })
      .andWhere('advertising.status =:status', { status: true })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().format('YYYY-MM-DD'),
      })
      .getOne();

    if (!postBackDaily) throw new NotFoundException();

    const { campaign } = postBackDaily;
    const { media } = campaign;

    const postBackInstallAppsflyer: PostBackInstallAppsflyerMetaData = {
      clickid,
      af_siteid,
      af_c_id,
      advertising_id,
      idfa,
      idfv,
      install_time,
      country_code,
      language,
      click_time,
      device_carrier,
      device_ip,
      originalUrl,
    };

    const postBackInstallAppsflyerEntity: PostBackInstallAppsflyer =
      await this.postBackInstallAppsflyerRepository.save(
        postBackInstallAppsflyer,
      );

    if (campaign.status) {
      const convertedPostbackInstallUrlTemplate =
        media.mediaPostbackInstallUrlTemplate
          .replace('{click_id}', clickid)
          .replace('{device_id}', idfa ? idfa : idfa)
          .replace('{android_device_id}', idfa)
          .replace('{ios_device_id}', idfv)
          .replace('{install_timestamp}', install_time);

      console.log(
        `[ mecrosspro ---> media ] install : ${convertedPostbackInstallUrlTemplate}`,
      );

      if (
        campaign &&
        campaign.postBackEvent &&
        campaign.postBackEvent[0].sendPostback === true
      ) {
        await this.httpService
          .get(convertedPostbackInstallUrlTemplate)
          .toPromise()
          .then(() => {
            postBackInstallAppsflyerEntity.isSendDate = new Date();
          })
          .catch();

        await this.postBackInstallAppsflyerRepository.save(
          postBackInstallAppsflyerEntity,
        );
      }
    }

    postBackDaily.install = +postBackDaily.install + 1;
    await this.postBackDailyRepository.save(postBackDaily);

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
      install_time,
      country_code,
      language,
      event_name,
      event_revenue_currency,
      event_revenue,
      event_time,
      device_carrier,
      device_ip,
    } = req.query;

    console.log(
      `[ appsflyer ---> mecrosspro ] cp_token:${af_c_id}, view_code:${af_siteid}, click_id:${clickid}`,
    );

    const postBackDaily: PostBackDaily = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .leftJoinAndSelect('postBackDaily.campaign', 'campaign')
      .leftJoinAndSelect('campaign.advertising', 'advertising')
      .leftJoinAndSelect('campaign.media', 'media')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .where('postBackDaily.view_code =:view_code', {
        view_code: af_siteid,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: af_c_id })
      .andWhere('advertising.status =:status', { status: true })
      .getOne();

    if (!postBackDaily) throw new NotFoundException();

    const { campaign } = postBackDaily;
    const { media } = campaign;

    const postBackEventAppsflyer: PostBackEventAppsflyerMetaData = {
      clickid,
      af_siteid,
      af_c_id,
      advertising_id,
      idfa,
      idfv,
      install_time,
      country_code,
      language,
      event_name,
      event_revenue_currency,
      event_revenue,
      event_time,
      device_carrier,
      device_ip,
      originalUrl,
    };

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

      console.log(
        `[ mecrosspro ---> media ] event : ${convertedPostbackEventUrlTemplate}`,
      );

      if (
        campaign &&
        campaign.postBackEvent &&
        campaign.postBackEvent[0].sendPostback
      ) {
        await this.httpService
          .get(convertedPostbackEventUrlTemplate)
          .toPromise()
          .then(() => {
            postbackEventApppsflyerEntity.isSendDate = new Date();
          })
          .catch();
        await this.postbackEventAppsflyerRepository.save(
          postbackEventApppsflyerEntity,
        );
      }
    }

    const postBackEventEntity: PostBackEvent =
      await this.postBackEventRepository.findOne({
        where: { campaign: campaign, trackerPostback: event_name },
      });

    if (postBackEventEntity) {
      switch (postBackEventEntity.adminPostback) {
        case 'install':
          postBackDaily.install = +postBackDaily.install + 1;
          break;
        case 'signup':
          postBackDaily.signup = +postBackDaily.signup + 1;
          break;
        case 'retention':
          postBackDaily.retention = +postBackDaily.retention + 1;
          break;
        case 'buy':
          postBackDaily.buy = +postBackDaily.buy + 1;
          break;
        case 'etc1':
          postBackDaily.etc1 = +postBackDaily.etc1 + 1;
          break;
        case 'etc2':
          postBackDaily.etc2 = +postBackDaily.etc2 + 1;
          break;
        case 'etc3':
          postBackDaily.etc3 = +postBackDaily.etc3 + 1;
          break;
        case 'etc4':
          postBackDaily.etc4 = +postBackDaily.etc4 + 1;
          break;
        case 'etc5':
          postBackDaily.etc5 = +postBackDaily.etc5 + 1;
          break;
      }

      await this.postBackDailyRepository.save(postBackDaily);
    } else {
      const postBackUnregisteredEventEntity: PostBackUnregisteredEvent =
        await this.postBackUnregisteredEventRepository.findOne({
          where: {
            event_name: event_name,
            postBackDaily: postBackDaily,
          },
        });

      if (postBackUnregisteredEventEntity) {
        postBackUnregisteredEventEntity.event_count =
          +postBackUnregisteredEventEntity.event_count + 1;

        await this.postBackUnregisteredEventRepository.save(
          postBackUnregisteredEventEntity,
        );
      } else {
        const postBackUnregisteredEvent: PostBackUnregisteredEventMetaData = {
          postBackDaily,
          event_name,
        };

        await this.postBackUnregisteredEventRepository.save(
          postBackUnregisteredEvent,
        );
      }
    }
    return;
  }
}
