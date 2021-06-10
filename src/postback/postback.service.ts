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

    const subMedia: SubMedia = await this.subMediaRepository
      .createQueryBuilder('subMedia')
      .leftJoinAndSelect('subMedia.advertising', 'advertising')
      .leftJoinAndSelect('subMedia.campaign', 'campaign')
      .leftJoinAndSelect('subMedia.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .where('subMedia.view_code =:view_code', {
        view_code: af_siteid,
      })
      .andWhere('subMedia.cp_token =:cp_token', { cp_token: af_c_id })
      .andWhere('postBackEvent.trackerPostBack =:trackerPostBack', {
        trackerPostBack: 'install',
      })
      .andWhere('advertising.ad_status =:ad_status', { ad_status: true })
      .andWhere('Date(subMedia.created_at) =:date ', {
        date: moment().format('YYYY-MM-DD'),
      })
      .getOne();

    if (!subMedia) throw new NotFoundException();

    const { campaign, media } = subMedia;

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

    subMedia.install = +subMedia.install + 1;
    await this.subMediaRepository.save(subMedia);

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

    const subMedia: SubMedia = await this.subMediaRepository
      .createQueryBuilder('subMedia')
      .leftJoinAndSelect('subMedia.advertising', 'advertising')
      .leftJoinAndSelect('subMedia.campaign', 'campaign')
      .leftJoinAndSelect('subMedia.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .where('subMedia.view_code =:view_code', {
        view_code: af_siteid,
      })
      .andWhere('subMedia.cp_token =:cp_token', { cp_token: af_c_id })
      .andWhere('advertising.ad_status =:ad_status', { ad_status: true })
      .getOne();

    if (!subMedia) throw new NotFoundException();

    const { campaign, media } = subMedia;

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
          subMedia.install = +subMedia.install + 1;
          break;
        case 'signup':
          subMedia.signup = +subMedia.signup + 1;
          break;
        case 'retention':
          subMedia.retention = +subMedia.retention + 1;
          break;
        case 'buy':
          subMedia.buy = +subMedia.buy + 1;
          break;
        case 'etc1':
          subMedia.etc1 = +subMedia.etc1 + 1;
          break;
        case 'etc2':
          subMedia.etc2 = +subMedia.etc2 + 1;
          break;
        case 'etc3':
          subMedia.etc3 = +subMedia.etc3 + 1;
          break;
        case 'etc4':
          subMedia.etc4 = +subMedia.etc4 + 1;
          break;
        case 'etc5':
          subMedia.etc5 = +subMedia.etc5 + 1;
          break;
      }

      await this.subMediaRepository.save(subMedia);
    } else {
      const postBackUnregisteredEventEntity: PostBackUnregisteredEvent =
        await this.postBackUnregisteredEventRepository.findOne({
          where: {
            event_name: event_name,
            subMedia: subMedia,
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
          subMedia,
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
