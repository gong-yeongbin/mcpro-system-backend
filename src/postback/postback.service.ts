import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubMedia } from 'src/entities/SubMedia';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { PostBackEvent } from 'src/entities/PostBackEvent';
import {
  PostBackEventAppsflyer,
  PostBackEventAppsflyerMetaData,
} from 'src/entities/PostBackEventAppsflyer';
import { AppsflyerPostbackInstallDto } from './dto/appsflyer-postback-install.dto';
import { Request } from 'express';
import {
  PostBackInstallAppsflyer,
  PostBackInstallAppsflyerMetaData,
} from 'src/entities/PostBackInstallAppsflyer';
import { AppsflyerPostbackEventDto } from './dto/appsflyer-postback-event.dto';
import {
  PostBackUnregisteredEvent,
  PostBackUnregisteredEventMetaData,
} from 'src/entities/PostBackUnregisteredEvent';

@Injectable()
export class PostbackService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(SubMedia)
    private readonly subMediaRepository: Repository<SubMedia>,
    @InjectRepository(PostBackEvent)
    private readonly postBackEventRepository: Repository<PostBackEvent>,
    @InjectRepository(PostBackUnregisteredEvent)
    private readonly postBackUnregisteredEventRepository: Repository<PostBackUnregisteredEvent>,
    @InjectRepository(PostBackInstallAppsflyer)
    private readonly postBackInstallAppsflyerRepository: Repository<PostBackInstallAppsflyer>,
    @InjectRepository(PostBackEventAppsflyer)
    private readonly postbackEventAppsflyerRepository: Repository<PostBackEventAppsflyer>,
  ) {}

  async postBackInstallAppsflyer(
    req: Request,
    query: AppsflyerPostbackInstallDto,
  ) {
    console.log(
      `[ appsflyer ---> mecrosspro ] install : ${req.protocol}://${req.headers.host}${req.url}`,
    );
    const originalUrl: string = `${req.protocol}://${req.get('host')}${
      req.originalUrl
    }` as string;

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
    } = query;

    console.log(
      `[ appsflyer ---> mecrosspro ] tracker:appsflyer, type:install, cpToken:${af_c_id}, viewCode:${af_siteid}, click_id:${clickid}`,
    );

    const subMediaEntity: SubMedia = await this.subMediaRepository
      .createQueryBuilder('subMedia')
      .leftJoinAndSelect('subMedia.advertising', 'advertising')
      .leftJoinAndSelect('subMedia.campaign', 'campaign')
      .leftJoinAndSelect('subMedia.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .where('subMedia.view_code =:viewCode', {
        viewCode: af_siteid,
      })
      .andWhere('subMedia.cp_token =:cpToken', { cpToken: af_c_id })
      .andWhere('postBackEvent.trackerPostBack =:trackerPostBack', {
        trackerPostBack: 'install',
      })
      .andWhere('advertising.ad_status =:adStatus', { adStatus: true })
      .andWhere('Date(subMedia.created_at) =:date ', {
        date: moment().format('YYYY-MM-DD'),
      })
      .getOne();

    if (!subMediaEntity) throw new NotFoundException();

    const { campaign, media } = subMediaEntity;

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

    if (campaign.cp_status) {
      const convertedPostbackInstallUrlTemplate =
        media.mediaPostbackInstallUrlTemplate
          .replace('{click_id}', clickid)
          .replace('{device_id}', advertising_id ? advertising_id : idfa)
          .replace('{android_device_id}', advertising_id)
          .replace('{ios_device_id}', idfa)
          .replace('{install_timestamp}', install_time);

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

    subMediaEntity.install = +subMediaEntity.install + 1;
    await this.subMediaRepository.save(subMediaEntity);

    return;
  }

  async postBackEventAppsflyer(req: Request, query: AppsflyerPostbackEventDto) {
    console.log(
      `[ appsflyer ---> mecrosspro ] event : ${req.protocol}://${req.headers.host}${req.url}`,
    );
    const originalUrl: string = `${req.protocol}://${req.get('host')}${
      req.originalUrl
    }` as string;

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
    } = query;

    console.log(
      `[ appsflyer ---> mecrosspro ] event : type:event, cpToken:${af_c_id}, viewCode:${af_siteid}, click_id:${clickid}`,
    );

    const subMediaEntity: SubMedia = await this.subMediaRepository
      .createQueryBuilder('subMedia')
      .leftJoinAndSelect('subMedia.advertising', 'advertising')
      .leftJoinAndSelect('subMedia.campaign', 'campaign')
      .leftJoinAndSelect('subMedia.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .where('subMedia.view_code =:viewCode', {
        viewCode: af_siteid,
      })
      .andWhere('subMedia.cp_token =:cpToken', { cpToken: af_c_id })
      .andWhere('advertising.ad_status =:adStatus', { adStatus: true })
      .getOne();

    if (!subMediaEntity) throw new NotFoundException();

    const { campaign, media } = subMediaEntity;

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

    if (campaign.cp_status) {
      const convertedPostbackEventUrlTemplate =
        media.mediaPostbackEventUrlTemplate
          .replace('{click_id}', clickid)
          .replace('{event_name}', event_name)
          .replace('{event_value}', event_revenue)
          .replace('{device_id}', advertising_id ? advertising_id : idfa)
          .replace('{android_device_id}', advertising_id)
          .replace('{ios_device_id}', idfa)
          .replace('{install_timestamp}', install_time)
          .replace('{event_timestamp}', event_time);

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
          subMediaEntity.install = +subMediaEntity.install + 1;
          break;
        case 'signup':
          subMediaEntity.signup = +subMediaEntity.signup + 1;
          break;
        case 'retention':
          subMediaEntity.retention = +subMediaEntity.retention + 1;
          break;
        case 'buy':
          subMediaEntity.buy = +subMediaEntity.buy + 1;
          break;
        case 'etc1':
          subMediaEntity.etc1 = +subMediaEntity.etc1 + 1;
          break;
        case 'etc2':
          subMediaEntity.etc2 = +subMediaEntity.etc2 + 1;
          break;
        case 'etc3':
          subMediaEntity.etc3 = +subMediaEntity.etc3 + 1;
          break;
        case 'etc4':
          subMediaEntity.etc4 = +subMediaEntity.etc4 + 1;
          break;
        case 'etc5':
          subMediaEntity.etc5 = +subMediaEntity.etc5 + 1;
          break;
      }

      await this.subMediaRepository.save(subMediaEntity);
    } else {
      const postBackUnregisteredEventEntity: PostBackUnregisteredEvent =
        await this.postBackUnregisteredEventRepository.findOne({
          where: { eventName: event_name, campaign: campaign },
        });

      if (postBackUnregisteredEventEntity) {
        postBackUnregisteredEventEntity.event_count =
          +postBackUnregisteredEventEntity.event_count + 1;
        await this.postBackUnregisteredEventRepository.save(
          postBackUnregisteredEventEntity,
        );
      } else {
        const postBackUnregisteredEvent: PostBackUnregisteredEventMetaData = {
          campaign,
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
