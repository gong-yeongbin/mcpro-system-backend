import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { PostBackInstallAdbrixremaster, PostBackEventAdbrixremaster, Campaign, Media, PostBackDaily, PostBackEvent, Advertising } from '../../entities/Entity';

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
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.headers.host}${req.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] install : ${originalUrl}`);

    const postBackInstallAdbrixremaster: PostBackInstallAdbrixremaster = this.postBackInstallAdbrixremasterRepository.create({
      view_code: req.query.cb_2,
      token: req.query.cb_1,
      a_key: req.query.a_key,
      a_cookie: req.query.a_cookie,
      a_ip: req.query.a_ip,
      a_fp: req.query.a_fp,
      a_country: req.query.a_country,
      a_city: req.query.a_city,
      a_region: req.query.a_region,
      a_appkey: req.query.a_appkey,
      m_publisher: req.query.m_publisher,
      m_sub_publisher: req.query.m_sub_publisher,
      adid: req.query.adid,
      idfv: req.query.idfv,
      ad_id_opt_out: req.query.ad_id_opt_out,
      device_os_version: req.query.device_os_version,
      device_model: req.query.device_model,
      device_vendor: req.query.device_vendor,
      device_resolution: req.query.device_resolution,
      device_portrait: req.query.device_portrait,
      device_platform: req.query.device_platform,
      device_network: req.query.device_network,
      device_wifi: req.query.device_wifi,
      device_carrier: req.query.device_carrier,
      device_language: req.query.device_language,
      device_country: req.query.device_country,
      device_build_id: req.query.device_build_id,
      package_name: req.query.package_name,
      appkey: req.query.appkey,
      sdk_version: req.query.sdk_version,
      installer: req.query.installer,
      app_version: req.query.app_version,
      attr_type: req.query.attr_type,
      event_name: req.query.event_name,
      event_datetime: moment.utc(req.query.event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      deeplink_path: req.query.deeplink_path,
      market_install_btn_clicked: req.query.market_install_btn_clicked,
      app_install_start: req.query.app_install_start,
      app_install_completed: req.query.app_install_completed,
      app_first_open: req.query.app_first_open,
      seconds_gap: req.query.seconds_gap,
      cb_1: req.query.cb_1,
      cb_2: req.query.cb_2,
      cb_3: req.query.cb_3,
      cb_4: req.query.cb_4,
      cb_5: req.query.cb_5,
      originalUrl: originalUrl,
      a_server_datetime: moment.utc(req.query.a_server_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
    });

    await this.postBackInstallAdbrixremasterRepository.save(postBackInstallAdbrixremaster);

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: postBackInstallAdbrixremaster.cb_1 },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException('not found campaign');

    const advertisingEntity: Advertising = campaignEntity.advertising;
    const mediaEntity: Media = campaignEntity.media;
    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: 'install' },
    });

    if (postBackEventEntity.sendPostback) {
      const convertedPostbackInstallUrlTemplate = mediaEntity.mediaPostbackInstallUrlTemplate
        .replace('{click_id}', postBackInstallAdbrixremaster.cb_3)
        .replace('{device_id}', postBackInstallAdbrixremaster.adid)
        .replace('{android_device_id}', advertisingEntity.platform.toLowerCase() == 'aos' ? postBackInstallAdbrixremaster.adid : '')
        .replace('{ios_device_id}', advertisingEntity.platform.toLowerCase() == 'ios' ? postBackInstallAdbrixremaster.adid : '')
        .replace('{install_timestamp}', postBackInstallAdbrixremaster.event_datetime)
        .replace('{payout}', '');

      await this.httpService
        .get(convertedPostbackInstallUrlTemplate)
        .toPromise()
        .then(async () => {
          console.log(`[ mecrosspro ---> media ] install : ${convertedPostbackInstallUrlTemplate}`);
          postBackInstallAdbrixremaster.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
          await this.postBackInstallAdbrixremasterRepository.save(postBackInstallAdbrixremaster);
        })
        .catch();
    }
    return;
  }

  async postBackEventAdbrixRemaster(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.headers.host}${req.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] event : ${originalUrl}`);
    const postBackEventAdbrixremaster: PostBackEventAdbrixremaster = this.postBackEventAdbrixremasterRepository.create({
      view_code: req.query.cb_2,
      token: req.query.cb_1,
      a_key: req.query.a_key,
      a_cookie: req.query.a_cookie,
      a_ip: req.query.a_ip,
      a_fp: req.query.a_fp,
      a_country: req.query.a_country,
      a_city: req.query.a_city,
      a_region: req.query.a_region,
      a_appkey: req.query.a_appkey,
      m_publisher: req.query.m_publisher,
      m_sub_publisher: req.query.m_sub_publisher,
      attr_adid: req.query.attr_adid,
      attr_event_datetime: moment.utc(req.query.attr_event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      attr_event_timestamp: req.query.attr_event_timestamp,
      attr_seconds_gap: req.query.attr_seconds_gap,
      adid: req.query.adid,
      idfv: req.query.idfv,
      ad_id_opt_out: req.query.ad_id_opt_out,
      device_os_version: req.query.device_os_version,
      device_model: req.query.device_model,
      device_vendor: req.query.device_vendor,
      device_resolution: req.query.device_resolution,
      device_portrait: req.query.device_portrait,
      device_platform: req.query.device_platform,
      device_network: req.query.device_network,
      device_wifi: req.query.device_wifi,
      device_carrier: req.query.device_carrier,
      device_language: req.query.device_language,
      device_country: req.query.device_country,
      device_build_id: req.query.device_build_id,
      package_name: req.query.package_name,
      appkey: req.query.appkey,
      sdk_version: req.query.sdk_version,
      installer: req.query.installer,
      app_version: req.query.app_version,
      event_name: req.query.event_name,
      event_datetime: moment.utc(req.query.event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      event_timestamp: req.query.event_timestamp,
      event_timestamp_d: req.query.event_timestamp_d,
      cb_1: req.query.cb_1,
      cb_2: req.query.cb_2,
      cb_3: req.query.cb_3,
      cb_4: req.query.cb_4,
      cb_5: req.query.cb_5,
      param_json: req.query.param_json,
      originalUrl: originalUrl,
    });

    if (postBackEventAdbrixremaster.param_json['abx:item.abx:sales']) {
      postBackEventAdbrixremaster.product_id = postBackEventAdbrixremaster.param_json['abx:item.abx:product_id'];
      postBackEventAdbrixremaster.price = +postBackEventAdbrixremaster.param_json['abx:item.abx:sales'];
      postBackEventAdbrixremaster.currency = postBackEventAdbrixremaster.param_json['abx:item.abx:currency'];
    } else if (postBackEventAdbrixremaster.param_json['abx:items']) {
      postBackEventAdbrixremaster.price = 0;
      for (const item of postBackEventAdbrixremaster.param_json['abx:items']) {
        postBackEventAdbrixremaster.price += +item['abx:sales'];
        postBackEventAdbrixremaster.product_id = item['abx:product_id'];
        postBackEventAdbrixremaster.currency = item['abx:currency'];
      }
    }
    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: postBackEventAdbrixremaster.cb_1 },
      relations: ['media', 'advertising'],
    });
    if (!campaignEntity) throw new NotFoundException('not found campaign');
    const advertisingEntity: Advertising = campaignEntity.advertising;
    const mediaEntity: Media = campaignEntity.media;
    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: postBackEventAdbrixremaster.event_name },
    });
    let postBackDailyEntity: PostBackDaily = await this.postBackDailyRepository
      .createQueryBuilder('postBackDaily')
      .where('postBackDaily.view_code =:view_code', {
        view_code: postBackEventAdbrixremaster.cb_2,
      })
      .andWhere('postBackDaily.cp_token =:cp_token', { cp_token: postBackEventAdbrixremaster.cb_1 })
      .andWhere('Date(postBackDaily.created_at) =:date ', {
        date: moment().tz('Asia/Seoul').format('YYYYMMDD'),
      })
      .getOne();
    if (!postBackDailyEntity)
      postBackDailyEntity = await this.commonService.createPostBackDaily(postBackEventAdbrixremaster.cb_2, postBackEventAdbrixremaster.cb_1);
    if (postBackEventEntity) {
      await this.commonService.dailyPostBackCountUp(postBackDailyEntity, postBackEventEntity, postBackEventAdbrixremaster.price || null);
      await this.postBackEventAdbrixremasterRepository.save(postBackEventAdbrixremaster);
      if (postBackEventEntity.sendPostback) {
        const convertedPostbackEventUrlTemplate = mediaEntity.mediaPostbackEventUrlTemplate
          .replace('{click_id}', postBackEventAdbrixremaster.cb_3)
          .replace('{event_name}', postBackEventAdbrixremaster.event_name)
          .replace('{event_value}', '')
          .replace('{device_id}', postBackEventAdbrixremaster.adid ? postBackEventAdbrixremaster.adid : postBackEventAdbrixremaster.idfv)
          .replace('{android_device_id}', advertisingEntity.platform.toLowerCase() == 'aos' ? postBackEventAdbrixremaster.adid : '')
          .replace('{ios_device_id}', advertisingEntity.platform.toLowerCase() == 'ios' ? postBackEventAdbrixremaster.adid : '')
          .replace('{install_timestamp}', postBackEventAdbrixremaster.attr_event_datetime)
          .replace('{event_timestamp}', postBackEventAdbrixremaster.event_timestamp)
          .replace('{timestamp}', postBackEventAdbrixremaster.event_timestamp);
        await this.httpService
          .get(convertedPostbackEventUrlTemplate)
          .toPromise()
          .then(async () => {
            console.log(`[ mecrosspro ---> media ] event : ${convertedPostbackEventUrlTemplate}`);
            postBackEventAdbrixremaster.send_time = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
            await this.postBackEventAdbrixremasterRepository.save(postBackEventAdbrixremaster);
          })
          .catch();
      }
    } else {
      await this.commonService.postBackUnregisteredEvent(postBackDailyEntity, postBackEventAdbrixremaster.event_name);
    }
    return;
  }
}
