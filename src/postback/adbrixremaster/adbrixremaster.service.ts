import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { AdbrixremasterInstall } from '../dto/adbrixremaster-install';
import { AdbrixremasterEvent } from '../dto/adbrixremaster-event';
import { PostBackInstallAdbrixremaster, PostBackEventAdbrixremaster, Campaign, Media, PostBackDaily, PostBackEvent } from '../../entities/Entity';

@Injectable()
export class AdbrixremasterService {
  constructor(
    private httpService: HttpService,
    private readonly commonService: CommonService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostBackDaily)
    private readonly postBackDailyRepository: Repository<PostBackDaily>,
    @InjectRepository(PostBackEvent)
    private readonly postBackEventRepository: Repository<PostBackEvent>,
    @InjectRepository(PostBackInstallAdbrixremaster)
    private readonly postBackInstallAdbrixremasterRepository: Repository<PostBackInstallAdbrixremaster>,
    @InjectRepository(PostBackEventAdbrixremaster)
    private readonly postBackEventAdbrixremasterRepository: Repository<PostBackEventAdbrixremaster>,
  ) {}

  async postBackInstallAdbrixRemaster(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    console.log(`[ adbrixremaster ---> mecrosspro ] install : ${originalUrl}`);

    const {
      a_key,
      a_cookie,
      a_ip,
      a_fp,
      a_country,
      a_city,
      a_region,
      a_appkey,
      m_publisher,
      m_sub_publisher,
      adid,
      idfv,
      ad_id_opt_out,
      device_os_version,
      device_model,
      device_vendor,
      device_resolution,
      device_portrait,
      device_platform,
      device_network,
      device_wifi,
      device_carrier,
      device_language,
      device_country,
      device_build_id,
      package_name,
      appkey,
      sdk_version,
      installer,
      app_version,
      attr_type,
      event_name,
      event_datetime,
      deeplink_path,
      market_install_btn_clicked,
      app_install_start,
      app_install_completed,
      app_first_open,
      seconds_gap,
      cb_1,
      cb_2,
      cb_3,
      cb_4,
      cb_5,
    } = new AdbrixremasterInstall(req.query).build();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: cb_1 },
      relations: ['media'],
    });

    if (!campaignEntity) throw new NotFoundException('not found campaign');

    const mediaEntity: Media = campaignEntity.media;

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: 'install' },
    });

    let postBackDailyEntity: PostBackDaily = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .where('postBackDaily.view_code =:view_code', {
        view_code: cb_2,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: cb_1 })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().tz('Asia/Seoul').format('YYYY-MM-DD'),
      })
      .getOne();

    if (!postBackDailyEntity) postBackDailyEntity = await this.commonService.createPostBackDaily(cb_2, cb_1);

    await this.commonService.dailyPostBackCountUp(postBackDailyEntity, postBackEventEntity);

    const postBackInstallAdbrixremaster: PostBackInstallAdbrixremaster = new PostBackInstallAdbrixremaster();
    postBackInstallAdbrixremaster.view_code = cb_2;
    postBackInstallAdbrixremaster.a_key = a_key;
    postBackInstallAdbrixremaster.a_cookie = a_cookie;
    postBackInstallAdbrixremaster.a_ip = a_ip;
    postBackInstallAdbrixremaster.a_fp = a_fp;
    postBackInstallAdbrixremaster.a_country = a_country;
    postBackInstallAdbrixremaster.a_city = a_city;
    postBackInstallAdbrixremaster.a_region = a_region;
    postBackInstallAdbrixremaster.a_appkey = a_appkey;
    postBackInstallAdbrixremaster.m_publisher = m_publisher;
    postBackInstallAdbrixremaster.m_sub_publisher = m_sub_publisher;
    postBackInstallAdbrixremaster.adid = adid;
    postBackInstallAdbrixremaster.idfv = idfv;
    postBackInstallAdbrixremaster.ad_id_opt_out = ad_id_opt_out;
    postBackInstallAdbrixremaster.device_os_version = device_os_version;
    postBackInstallAdbrixremaster.device_model = device_model;
    postBackInstallAdbrixremaster.device_vendor = device_vendor;
    postBackInstallAdbrixremaster.device_resolution = device_resolution;
    postBackInstallAdbrixremaster.device_portrait = device_portrait;
    postBackInstallAdbrixremaster.device_platform = device_platform;
    postBackInstallAdbrixremaster.device_network = device_network;
    postBackInstallAdbrixremaster.device_wifi = device_wifi;
    postBackInstallAdbrixremaster.device_carrier = device_carrier;
    postBackInstallAdbrixremaster.device_language = device_language;
    postBackInstallAdbrixremaster.device_country = device_country;
    postBackInstallAdbrixremaster.device_build_id = device_build_id;
    postBackInstallAdbrixremaster.package_name = package_name;
    postBackInstallAdbrixremaster.appkey = appkey;
    postBackInstallAdbrixremaster.sdk_version = sdk_version;
    postBackInstallAdbrixremaster.installer = installer;
    postBackInstallAdbrixremaster.app_version = app_version;
    postBackInstallAdbrixremaster.attr_type = attr_type;
    postBackInstallAdbrixremaster.event_name = event_name;
    postBackInstallAdbrixremaster.event_datetime = event_datetime;
    postBackInstallAdbrixremaster.deeplink_path = deeplink_path;
    postBackInstallAdbrixremaster.market_install_btn_clicked = market_install_btn_clicked;
    postBackInstallAdbrixremaster.app_install_start = app_install_start;
    postBackInstallAdbrixremaster.app_install_completed = app_install_completed;
    postBackInstallAdbrixremaster.app_first_open = app_first_open;
    postBackInstallAdbrixremaster.seconds_gap = seconds_gap;
    postBackInstallAdbrixremaster.cb_1 = cb_1;
    postBackInstallAdbrixremaster.cb_2 = cb_2;
    postBackInstallAdbrixremaster.cb_3 = cb_3;
    postBackInstallAdbrixremaster.cb_4 = cb_4;
    postBackInstallAdbrixremaster.cb_5 = cb_5;
    postBackInstallAdbrixremaster.originalUrl = originalUrl;
    postBackInstallAdbrixremaster.campaign = campaignEntity;

    const postBackInstallAdbrixremasterEntity: PostBackInstallAdbrixremaster = await this.postBackInstallAdbrixremasterRepository.save(
      postBackInstallAdbrixremaster,
    );

    if (postBackEventEntity.sendPostback) {
      const convertedPostbackInstallUrlTemplate = mediaEntity.mediaPostbackInstallUrlTemplate
        .replace('{clickid}', cb_3)
        .replace('{click_id}', cb_3)
        .replace('{device_id}', adid ? adid : idfv)
        .replace('{android_device_id}', adid)
        .replace('{ios_device_id}', idfv)
        .replace('{install_timestamp}', event_datetime)
        .replace('{payout}', '');

      await this.httpService
        .get(convertedPostbackInstallUrlTemplate)
        .toPromise()
        .then(async () => {
          console.log(`[ mecrosspro ---> media ] install : ${convertedPostbackInstallUrlTemplate}`);
          postBackInstallAdbrixremasterEntity.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

          await this.postBackInstallAdbrixremasterRepository.save(postBackInstallAdbrixremasterEntity);
        })
        .catch();
    }

    return;
  }

  async postBackEventAdbrixRemaster(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] event : ${originalUrl}`);

    const {
      a_key,
      a_cookie,
      a_ip,
      a_fp,
      a_country,
      a_city,
      a_region,
      a_appkey,
      m_publisher,
      m_sub_publisher,
      attr_adid,
      attr_event_datetime,
      attr_event_timestamp,
      attr_seconds_gap,
      adid,
      idfv,
      ad_id_opt_out,
      device_os_version,
      device_model,
      device_vendor,
      device_resolution,
      device_portrait,
      device_platform,
      device_network,
      device_wifi,
      device_carrier,
      device_language,
      device_country,
      device_build_id,
      package_name,
      appkey,
      sdk_version,
      installer,
      app_version,
      event_name,
      event_datetime,
      event_timestamp,
      event_timestamp_d,
      param_json,
      cb_1,
      cb_2,
      cb_3,
      cb_4,
      cb_5,
    } = new AdbrixremasterEvent(req.query).build();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: cb_1 },
      relations: ['media'],
    });

    if (!campaignEntity) throw new NotFoundException('not found campaign');

    const mediaEntity: Media = campaignEntity.media;

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: event_name },
    });

    let postBackDailyEntity: PostBackDaily = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .where('postBackDaily.view_code =:view_code', {
        view_code: cb_2,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: cb_1 })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().tz('Asia/Seoul').format('YYYYMMDD'),
      })
      .getOne();

    if (!postBackDailyEntity) postBackDailyEntity = await this.commonService.createPostBackDaily(cb_2, cb_1);

    const postBackEventAdbrixremaster: PostBackEventAdbrixremaster = new PostBackEventAdbrixremaster();
    postBackEventAdbrixremaster.view_code = cb_2;
    postBackEventAdbrixremaster.a_key = a_key;
    postBackEventAdbrixremaster.a_cookie = a_cookie;
    postBackEventAdbrixremaster.a_ip = a_ip;
    postBackEventAdbrixremaster.a_fp = a_fp;
    postBackEventAdbrixremaster.a_country = a_country;
    postBackEventAdbrixremaster.a_city = a_city;
    postBackEventAdbrixremaster.a_region = a_region;
    postBackEventAdbrixremaster.a_appkey = a_appkey;
    postBackEventAdbrixremaster.m_publisher = m_publisher;
    postBackEventAdbrixremaster.m_sub_publisher = m_sub_publisher;
    postBackEventAdbrixremaster.attr_adid = attr_adid;
    postBackEventAdbrixremaster.attr_event_datetime = attr_event_datetime;
    postBackEventAdbrixremaster.attr_event_timestamp = attr_event_timestamp;
    postBackEventAdbrixremaster.attr_seconds_gap = attr_seconds_gap;
    postBackEventAdbrixremaster.adid = adid;
    postBackEventAdbrixremaster.idfv = idfv;
    postBackEventAdbrixremaster.ad_id_opt_out = ad_id_opt_out;
    postBackEventAdbrixremaster.device_os_version = device_os_version;
    postBackEventAdbrixremaster.device_model = device_model;
    postBackEventAdbrixremaster.device_vendor = device_vendor;
    postBackEventAdbrixremaster.device_resolution = device_resolution;
    postBackEventAdbrixremaster.device_portrait = device_portrait;
    postBackEventAdbrixremaster.device_platform = device_platform;
    postBackEventAdbrixremaster.device_network = device_network;
    postBackEventAdbrixremaster.device_wifi = device_wifi;
    postBackEventAdbrixremaster.device_carrier = device_carrier;
    postBackEventAdbrixremaster.device_language = device_language;
    postBackEventAdbrixremaster.device_country = device_country;
    postBackEventAdbrixremaster.device_build_id = device_build_id;
    postBackEventAdbrixremaster.package_name = package_name;
    postBackEventAdbrixremaster.appkey = appkey;
    postBackEventAdbrixremaster.sdk_version = sdk_version;
    postBackEventAdbrixremaster.installer = installer;
    postBackEventAdbrixremaster.app_version = app_version;
    postBackEventAdbrixremaster.event_name = event_name;
    postBackEventAdbrixremaster.event_datetime = event_datetime;
    postBackEventAdbrixremaster.event_timestamp = event_timestamp;
    postBackEventAdbrixremaster.event_timestamp_d = event_timestamp_d;
    postBackEventAdbrixremaster.param_json = param_json;
    postBackEventAdbrixremaster.cb_1 = cb_1;
    postBackEventAdbrixremaster.cb_2 = cb_2;
    postBackEventAdbrixremaster.cb_3 = cb_3;
    postBackEventAdbrixremaster.cb_4 = cb_4;
    postBackEventAdbrixremaster.cb_5 = cb_5;
    postBackEventAdbrixremaster.originalUrl = originalUrl;
    postBackEventAdbrixremaster.campaign = campaignEntity;

    const postBackEventAdbrixremasterEntity: PostBackEventAdbrixremaster = await this.postBackEventAdbrixremasterRepository.save(postBackEventAdbrixremaster);

    if (postBackEventEntity) {
      await this.commonService.dailyPostBackCountUp(postBackDailyEntity, postBackEventEntity);

      if (postBackEventEntity.sendPostback) {
        const convertedPostbackEventUrlTemplate = mediaEntity.mediaPostbackEventUrlTemplate
          .replace('{clickid}', cb_3)
          .replace('{click_id}', cb_3)
          .replace('{event-name}', event_name)
          .replace('{event_name}', event_name)
          .replace('{event_value}', '')
          .replace('{event-value}', '')
          .replace('{device_id}', adid ? adid : idfv)
          .replace('{android_device_id}', adid)
          .replace('{ios_device_id}', idfv)
          .replace('{install_timestamp}', attr_event_datetime)
          .replace('{event_timestamp}', event_timestamp)
          .replace('{timestamp}', event_timestamp);

        await this.httpService
          .get(convertedPostbackEventUrlTemplate)
          .toPromise()
          .then(async () => {
            console.log(`[ mecrosspro ---> media ] event : ${convertedPostbackEventUrlTemplate}`);
            postBackEventAdbrixremasterEntity.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
            await this.postBackEventAdbrixremasterRepository.save(postBackEventAdbrixremasterEntity);
          })
          .catch();
      }
    } else {
      await this.commonService.postBackUnregisteredEvent(postBackDailyEntity, event_name);
    }
    return;
  }
}
