import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { decodeUnicode } from 'src/util';
import { AppsflyerInstall } from '../dto/appsflyer-install';
import { AppsflyerEvent } from '../dto/appsflyer-event';
import { CommonService } from 'src/common/common.service';
import { PostBackDaily, Campaign, Media, PostBackEvent, PostBackEventAppsflyer, PostBackInstallAppsflyer, Advertising } from '../../entities/Entity';

@Injectable()
export class AppsflyerService {
  constructor(
    private httpService: HttpService,
    private readonly commonService: CommonService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostBackDaily)
    private readonly postBackDailyRepository: Repository<PostBackDaily>,
    @InjectRepository(PostBackEvent)
    private readonly postBackEventRepository: Repository<PostBackEvent>,
    @InjectRepository(PostBackInstallAppsflyer)
    private readonly postBackInstallAppsflyerRepository: Repository<PostBackInstallAppsflyer>,
    @InjectRepository(PostBackEventAppsflyer)
    private readonly postbackEventAppsflyerRepository: Repository<PostBackEventAppsflyer>,
  ) {}

  // appsflyer postback install
  async postBackInstallAppsflyer(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.headers.host}${req.url}`);

    console.log(`[ appsflyer ---> mecrosspro ] install : ${originalUrl}`);

    const { clickid, af_siteid, af_c_id, advertising_id, idfa, idfv, country_code, language, device_carrier, device_ip, install_time, click_time } =
      new AppsflyerInstall(req.query).build();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: af_c_id },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException('not found campaign');

    const advertisingEntity: Advertising = campaignEntity.advertising;
    const mediaEntity: Media = campaignEntity.media;

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: 'install' },
    });

    let postBackDailyEntity: PostBackDaily = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .where('postBackDaily.view_code =:view_code', {
        view_code: af_siteid,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: af_c_id })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().tz('Asia/Seoul').format('YYYY-MM-DD'),
      })
      .getOne();

    if (!postBackDailyEntity) postBackDailyEntity = await this.commonService.createPostBackDaily(af_siteid, af_c_id);

    await this.commonService.dailyPostBackCountUp(postBackDailyEntity, postBackEventEntity);

    const postBackInstallAppsflyer: PostBackInstallAppsflyer = new PostBackInstallAppsflyer();

    postBackInstallAppsflyer.view_code = af_siteid;
    postBackInstallAppsflyer.token = af_c_id;
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
    postBackInstallAppsflyer.campaign = campaignEntity;

    const postBackInstallAppsflyerEntity: PostBackInstallAppsflyer = await this.postBackInstallAppsflyerRepository.save(postBackInstallAppsflyer);

    if (postBackEventEntity.sendPostback) {
      const convertedPostbackInstallUrlTemplate = mediaEntity.mediaPostbackInstallUrlTemplate
        .replace('{click_id}', clickid)
        .replace('{device_id}', idfa)
        .replace('{android_device_id}', advertisingEntity.platform.toLowerCase() == 'aos' ? idfa : '')
        .replace('{ios_device_id}', advertisingEntity.platform.toLowerCase() == 'ios' ? idfa : '')
        .replace('{install_timestamp}', install_time)
        .replace('{payout}', '');

      await this.httpService
        .get(convertedPostbackInstallUrlTemplate)
        .toPromise()
        .then(async () => {
          console.log(`[ mecrosspro ---> media ] install : ${convertedPostbackInstallUrlTemplate}`);
          postBackInstallAppsflyerEntity.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

          await this.postBackInstallAppsflyerRepository.save(postBackInstallAppsflyerEntity);
        })
        .catch();
    }

    return;
  }

  // appsflyer postback event
  async postBackEventAppsflyer(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.headers.host}${req.url}`);

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
      install_time,
      event_time,
    } = new AppsflyerEvent(req.query).build();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: af_c_id },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException('not found campaign');

    const advertisingEntity: Advertising = campaignEntity.advertising;
    const mediaEntity: Media = campaignEntity.media;

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: event_name },
    });

    let postBackDailyEntity: PostBackDaily = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .where('postBackDaily.view_code =:view_code', {
        view_code: af_siteid,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: af_c_id })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().tz('Asia/Seoul').format('YYYYMMDD'),
      })
      .getOne();

    if (!postBackDailyEntity) postBackDailyEntity = await this.commonService.createPostBackDaily(af_siteid, af_c_id);

    const postBackEventAppsflyer: PostBackEventAppsflyer = new PostBackEventAppsflyer();

    postBackEventAppsflyer.view_code = af_siteid;
    postBackEventAppsflyer.token = af_c_id;
    postBackEventAppsflyer.clickid = clickid;
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
    postBackEventAppsflyer.campaign = campaignEntity;

    const postbackEventApppsflyerEntity: PostBackEventAppsflyer = await this.postbackEventAppsflyerRepository.save(postBackEventAppsflyer);

    if (postBackEventEntity) {
      await this.commonService.dailyPostBackCountUp(postBackDailyEntity, postBackEventEntity);

      if (postBackEventEntity.sendPostback) {
        const convertedPostbackEventUrlTemplate = mediaEntity.mediaPostbackEventUrlTemplate
          .replace('{click_id}', clickid)
          .replace('{event_name}', event_name)
          .replace('{event_value}', event_revenue)
          .replace('{device_id}', idfa)
          .replace('{android_device_id}', advertisingEntity.platform.toLowerCase() == 'aos' ? idfa : '')
          .replace('{ios_device_id}', advertisingEntity.platform.toLowerCase() == 'ios' ? idfa : '')
          .replace('{install_timestamp}', install_time)
          .replace('{event_timestamp}', event_time)
          .replace('{timestamp}', event_time);

        await this.httpService
          .get(convertedPostbackEventUrlTemplate)
          .toPromise()
          .then(async () => {
            console.log(`[ mecrosspro ---> media ] event : ${convertedPostbackEventUrlTemplate}`);
            postbackEventApppsflyerEntity.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

            await this.postbackEventAppsflyerRepository.save(postbackEventApppsflyerEntity);
          })
          .catch();
      }
    } else {
      await this.commonService.postBackUnregisteredEvent(postBackDailyEntity, event_name);
    }

    return;
  }
}
