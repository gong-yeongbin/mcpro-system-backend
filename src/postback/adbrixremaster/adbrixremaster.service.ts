import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { decodeUnicode } from 'src/util';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { PostBackInstallAdbrixremaster, PostBackEventAdbrixremaster, Campaign, PostBackDaily, PostBackEvent } from '../../entities/Entity';

@Injectable()
export class AdbrixremasterService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostBackEvent)
    private readonly postBackEventRepository: Repository<PostBackEvent>,
    @InjectRepository(PostBackInstallAdbrixremaster)
    private readonly postBackInstallAdbrixremasterRepository: Repository<PostBackInstallAdbrixremaster>,
    @InjectRepository(PostBackEventAdbrixremaster)
    private readonly postBackEventAdbrixremasterRepository: Repository<PostBackEventAdbrixremaster>,
  ) {}

  async postBackInstallAdbrixRemaster(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] install : ${originalUrl}`);

    const uuid: string = ['', undefined, '{uuid}'].includes(request.query.uuid) ? '' : request.query.uuid;

    const postBackInstallAdbrixremaster: PostBackInstallAdbrixremaster = this.postBackInstallAdbrixremasterRepository.create({
      view_code: request.query.cb_2,
      token: request.query.cb_1,
      a_key: request.query.a_key,
      a_cookie: request.query.a_cookie,
      a_ip: request.query.a_ip,
      a_fp: request.query.a_fp,
      a_country: request.query.a_country,
      a_city: request.query.a_city,
      a_region: request.query.a_region,
      a_appkey: request.query.a_appkey,
      m_publisher: request.query.m_publisher,
      m_sub_publisher: request.query.m_sub_publisher,
      adid: request.query.adid,
      idfv: request.query.idfv,
      ad_id_opt_out: request.query.ad_id_opt_out,
      device_os_version: request.query.device_os_version,
      device_model: request.query.device_model,
      device_vendor: request.query.device_vendor,
      device_resolution: request.query.device_resolution,
      device_portrait: request.query.device_portrait,
      device_platform: request.query.device_platform,
      device_network: request.query.device_network,
      device_wifi: request.query.device_wifi,
      device_carrier: request.query.device_carrier,
      device_language: request.query.device_language,
      device_country: request.query.device_country,
      device_build_id: request.query.device_build_id,
      package_name: request.query.package_name,
      appkey: request.query.appkey,
      sdk_version: request.query.sdk_version,
      installer: request.query.installer,
      app_version: request.query.app_version,
      attr_type: request.query.attr_type,
      event_name: request.query.event_name,
      event_datetime: moment.utc(request.query.event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      deeplink_path: request.query.deeplink_path,
      market_install_btn_clicked: request.query.market_install_btn_clicked,
      app_install_start: request.query.app_install_start,
      app_install_completed: request.query.app_install_completed,
      app_first_open: request.query.app_first_open,
      seconds_gap: request.query.seconds_gap,
      cb_1: request.query.cb_1,
      cb_2: request.query.cb_2,
      cb_3: request.query.cb_3,
      cb_4: request.query.cb_4,
      cb_5: request.query.cb_5,
      originalUrl: originalUrl,
      a_server_datetime: moment.utc(request.query.a_server_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
    });

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(
      postBackInstallAdbrixremaster.view_code,
      postBackInstallAdbrixremaster.token,
    );

    if (!postBackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: postBackInstallAdbrixremaster.token },
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
      const click_datetime: string = postBackInstallAdbrixremaster.a_server_datetime;

      const url: string = await this.commonService.convertedPostbackInstallUrl({
        uuid: uuid,
        click_id: click_id,
        adid: adid,
        event_datetime: event_datetime,
        click_datetime: click_datetime,
        campaignEntity: campaignEntity,
        postBackDailyEntity: postBackDailyEntity,
      });

      postBackInstallAdbrixremaster.send_time = await this.commonService.httpServiceHandler(url);
      postBackInstallAdbrixremaster.send_url = url;
    }

    await this.postBackInstallAdbrixremasterRepository.save(postBackInstallAdbrixremaster);
    await this.commonService.installCount(postBackDailyEntity);

    return;
  }

  async postBackEventAdbrixRemaster(request: any) {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ adbrixremaster ---> mecrosspro ] event : ${originalUrl}`);

    const uuid: string = ['', undefined, '{uuid}'].includes(request.query.uuid) ? '' : request.query.uuid;
    const postBackEventAdbrixremaster: PostBackEventAdbrixremaster = this.postBackEventAdbrixremasterRepository.create({
      view_code: request.query.cb_2,
      token: request.query.cb_1,
      a_key: request.query.a_key,
      a_cookie: request.query.a_cookie,
      a_ip: request.query.a_ip,
      a_fp: request.query.a_fp,
      a_country: request.query.a_country,
      a_city: request.query.a_city,
      a_region: request.query.a_region,
      a_appkey: request.query.a_appkey,
      m_publisher: request.query.m_publisher,
      m_sub_publisher: request.query.m_sub_publisher,
      attr_adid: request.query.attr_adid,
      attr_event_datetime: moment.utc(request.query.attr_event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      attr_event_timestamp: request.query.attr_event_timestamp,
      attr_seconds_gap: request.query.attr_seconds_gap,
      adid: request.query.adid,
      idfv: request.query.idfv,
      ad_id_opt_out: request.query.ad_id_opt_out,
      device_os_version: request.query.device_os_version,
      device_model: request.query.device_model,
      device_vendor: request.query.device_vendor,
      device_resolution: request.query.device_resolution,
      device_portrait: request.query.device_portrait,
      device_platform: request.query.device_platform,
      device_network: request.query.device_network,
      device_wifi: request.query.device_wifi,
      device_carrier: request.query.device_carrier,
      device_language: request.query.device_language,
      device_country: request.query.device_country,
      device_build_id: request.query.device_build_id,
      package_name: request.query.package_name,
      appkey: request.query.appkey,
      sdk_version: request.query.sdk_version,
      installer: request.query.installer,
      app_version: request.query.app_version,
      event_name: request.query.event_name,
      event_datetime: moment.utc(request.query.event_datetime.replace('+', ' ')).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss'),
      event_timestamp: request.query.event_timestamp,
      event_timestamp_d: request.query.event_timestamp_d,
      cb_1: request.query.cb_1,
      cb_2: request.query.cb_2,
      cb_3: request.query.cb_3,
      cb_4: request.query.cb_4,
      cb_5: request.query.cb_5,
      param_json: request.query.param_json,
      originalUrl: originalUrl,
      price: 0,
    });

    if (postBackEventAdbrixremaster.param_json != 'null' && postBackEventAdbrixremaster.param_json != '') {
      const jsonData: any = JSON.parse(postBackEventAdbrixremaster.param_json);

      if (jsonData['abx:item.abx:sales']) {
        postBackEventAdbrixremaster.price = +jsonData['abx:item.abx:sales'];
        postBackEventAdbrixremaster.currency = jsonData['abx:item.abx:currency'];
      } else if (jsonData['abx:items']) {
        for (const item of jsonData['abx:items']) {
          postBackEventAdbrixremaster.price += +item['abx:sales'];
          postBackEventAdbrixremaster.currency = item['abx:currency'];
        }
      }
    }
    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(
      postBackEventAdbrixremaster.view_code,
      postBackEventAdbrixremaster.token,
    );

    if (!postBackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: postBackEventAdbrixremaster.token },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: postBackEventAdbrixremaster.event_name },
    });

    if (postBackEventEntity && postBackEventEntity.sendPostback) {
      const click_id: string = postBackEventAdbrixremaster.cb_3;
      const adid: string = postBackEventAdbrixremaster.adid;
      const event_name: string = postBackEventAdbrixremaster.event_name;
      const install_datetime: string = postBackEventAdbrixremaster.attr_event_datetime;
      const event_datetime: string = postBackEventAdbrixremaster.event_timestamp;

      const url: string = await this.commonService.convertedPostbackEventUrl({
        uuid: uuid,
        click_id: click_id,
        adid: adid,
        event_name: event_name,
        event_datetime: event_datetime,
        install_datetime: install_datetime,
        campaignEntity: campaignEntity,
        postBackDailyEntity: postBackDailyEntity,
      });

      postBackEventAdbrixremaster.send_time = await this.commonService.httpServiceHandler(url);
      postBackEventAdbrixremaster.send_url = url;
    } else {
      await this.commonService.postBackUnregisteredEvent(postBackDailyEntity, postBackEventAdbrixremaster.event_name);
    }

    const cases = {
      signup: this.commonService.signupCount,
      retention: this.commonService.retentionCount,
      buy: this.commonService.buyCount,
      etc1: this.commonService.etc1Count,
      etc2: this.commonService.etc2Count,
      etc3: this.commonService.etc3Count,
      etc4: this.commonService.etc4Count,
      etc5: this.commonService.etc5Count,
    };

    await this.postBackEventAdbrixremasterRepository.save(postBackEventAdbrixremaster);
    await cases[postBackEventEntity.adminPostback](postBackDailyEntity, postBackEventAdbrixremaster.price);

    return;
  }
}
