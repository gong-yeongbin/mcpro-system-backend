import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { PostBackInstallAdbrixremaster, PostBackEventAdbrixremaster, Campaign, Media, PostBackDaily, PostBackEvent, Advertising } from '../../entities/Entity';

@Injectable()
export class AdbrixremasterService {
  constructor(
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

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(postBackInstallAdbrixremaster.view_code);
    postBackDailyEntity.install++;
    await this.postBackDailyRepository.save(postBackDailyEntity);

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: postBackInstallAdbrixremaster.cb_1 },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: 'install' },
    });

    if (postBackEventEntity.sendPostback) {
      const click_id: string = postBackInstallAdbrixremaster.cb_3;
      const adid: string = postBackInstallAdbrixremaster.adid;
      const event_datetime: string = postBackInstallAdbrixremaster.event_datetime;

      const url: string = await this.commonService.convertedPostbackInstallUrl({
        click_id: click_id,
        adid: adid,
        event_datetime: event_datetime,
        campaignEntity: campaignEntity,
      });

      postBackInstallAdbrixremaster.send_time = await this.commonService.httpServiceHandler(url);
    }

    await this.postBackInstallAdbrixremasterRepository.save(postBackInstallAdbrixremaster);

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
      price: 0,
    });

    if (postBackEventAdbrixremaster.param_json != 'null' && postBackEventAdbrixremaster.param_json != '') {
      const jsonData: any = JSON.parse(postBackEventAdbrixremaster.param_json);

      if (jsonData['abx:item.abx:sales']) {
        postBackEventAdbrixremaster.product_id = jsonData['abx:item.abx:product_id'];
        postBackEventAdbrixremaster.price = +jsonData['abx:item.abx:sales'];
        postBackEventAdbrixremaster.currency = jsonData['abx:item.abx:currency'];
      } else if (jsonData['abx:items']) {
        for (const item of jsonData['abx:items']) {
          postBackEventAdbrixremaster.price += +item['abx:sales'];
          postBackEventAdbrixremaster.product_id = item['abx:product_id'];
          postBackEventAdbrixremaster.currency = item['abx:currency'];
        }
      }
    }

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: postBackEventAdbrixremaster.cb_1 },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: postBackEventAdbrixremaster.event_name },
    });

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(postBackEventAdbrixremaster.view_code);

    if (postBackDailyEntity && postBackEventEntity) {
      await this.commonService.dailyPostBackCountUp(postBackDailyEntity, postBackEventEntity, postBackEventAdbrixremaster.price | 0);

      if (postBackEventEntity.sendPostback) {
        const click_id: string = postBackEventAdbrixremaster.cb_3;
        const adid: string = postBackEventAdbrixremaster.adid;
        const event_name: string = postBackEventAdbrixremaster.event_name;
        const install_datetime: string = postBackEventAdbrixremaster.attr_event_datetime;
        const event_datetime: string = postBackEventAdbrixremaster.event_timestamp;

        const url: string = await this.commonService.convertedPostbackEventUrl({
          click_id: click_id,
          adid: adid,
          event_name: event_name,
          event_datetime: event_datetime,
          install_datetime: install_datetime,
          campaignEntity: campaignEntity,
        });

        postBackEventAdbrixremaster.send_time = await this.commonService.httpServiceHandler(url);
      }

      await this.postBackEventAdbrixremasterRepository.save(postBackEventAdbrixremaster);
    } else {
      await this.commonService.postBackUnregisteredEvent(postBackDailyEntity, postBackEventAdbrixremaster.event_name);
    }

    return;
  }
}
