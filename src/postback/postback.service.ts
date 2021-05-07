import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubMedia } from 'src/entities/SubMedia';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { PostBackEvent } from 'src/entities/PostBackEvent';
import { AdbrixRemasterPostbackInstallDto } from './dto/adbrix-remaster-postback-install.dto';
import { AdbrixRemasterPostbackEventDto } from './dto/adbrix-remaster-postback-event.dto';
import { PostBackInstallAdbrixRemaster } from 'src/entities/PostBackInstallAdbrixRemaster';
import { PostBackEventAdbrixRemaster } from 'src/entities/PostBackEventAdbrixRemaster';

@Injectable()
export class PostbackService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(SubMedia)
    private readonly subMediaRepository: Repository<SubMedia>,
    @InjectRepository(PostBackEvent)
    private readonly postBackEventRepository: Repository<PostBackEvent>,
    @InjectRepository(PostBackInstallAdbrixRemaster)
    private readonly postBackInstallAdbrixRemasterRepository: Repository<PostBackInstallAdbrixRemaster>,
    @InjectRepository(PostBackEventAdbrixRemaster)
    private readonly postBackEventAdbrixRemasterRepository: Repository<PostBackEventAdbrixRemaster>,
  ) {}

  async postBackInstallAdbrixRemaster(
    req: any,
    query: AdbrixRemasterPostbackInstallDto,
  ) {
    const originalUrl: string = `${req.protocol}://${req.get('host')}${
      req.originalUrl
    }` as string;

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
      cb_1, //캠페인 토큰
      cb_2, //노출코드
      cb_3, //click id
      cb_4,
      cb_5,
    } = query;

    const subMediaEntity: SubMedia = await this.subMediaRepository
      .createQueryBuilder('subMedia')
      .leftJoinAndSelect('subMedia.advertising', 'advertising')
      .leftJoinAndSelect('subMedia.campaign', 'campaign')
      .leftJoinAndSelect('subMedia.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .where('subMedia.viewCode =:viewCode', {
        viewCode: cb_2,
      })
      .andWhere('subMedia.cpToken =:cpToken', { cpToken: cb_1 })
      .andWhere('postBackEvent.trackerPostBack =:trackerPostBack', {
        trackerPostBack: 'install',
      })
      .andWhere('advertising.adStatus =:adStatus', { adStatus: true })
      .getOne();

    if (!subMediaEntity) {
      throw new NotFoundException();
    }

    const { campaign, media } = subMediaEntity;

    const postBackInstallAdbrixRemaster: PostBackInstallAdbrixRemaster = new PostBackInstallAdbrixRemaster();
    postBackInstallAdbrixRemaster.cpToken = cb_1;
    postBackInstallAdbrixRemaster.aKey = a_key;
    postBackInstallAdbrixRemaster.aCookie = a_cookie;
    postBackInstallAdbrixRemaster.aIp = a_ip;
    postBackInstallAdbrixRemaster.aFp = a_fp;
    postBackInstallAdbrixRemaster.aCountry = a_country;
    postBackInstallAdbrixRemaster.aCity = a_city;
    postBackInstallAdbrixRemaster.aRegion = a_region;
    postBackInstallAdbrixRemaster.aAppkey = a_appkey;
    postBackInstallAdbrixRemaster.mPublisher = m_publisher;
    postBackInstallAdbrixRemaster.mSubPublisher = m_sub_publisher;
    postBackInstallAdbrixRemaster.adid = adid;
    postBackInstallAdbrixRemaster.idfv = idfv;
    postBackInstallAdbrixRemaster.adIdOptOut = ad_id_opt_out;
    postBackInstallAdbrixRemaster.deviceOsVersion = device_os_version;
    postBackInstallAdbrixRemaster.deviceModel = device_model;
    postBackInstallAdbrixRemaster.deviceVendor = device_vendor;
    postBackInstallAdbrixRemaster.deviceResolution = device_resolution;
    postBackInstallAdbrixRemaster.devicePortrait = device_portrait;
    postBackInstallAdbrixRemaster.devicePlatform = device_platform;
    postBackInstallAdbrixRemaster.deviceNetwork = device_network;
    postBackInstallAdbrixRemaster.deviceWifi = device_wifi;
    postBackInstallAdbrixRemaster.deviceCarrier = device_carrier;
    postBackInstallAdbrixRemaster.deviceLanguage = device_language;
    postBackInstallAdbrixRemaster.deviceCountry = device_country;
    postBackInstallAdbrixRemaster.deviceBuildId = device_build_id;
    postBackInstallAdbrixRemaster.packageName = package_name;
    postBackInstallAdbrixRemaster.appkey = appkey;
    postBackInstallAdbrixRemaster.sdkVersion = sdk_version;
    postBackInstallAdbrixRemaster.installer = installer;
    postBackInstallAdbrixRemaster.appVersion = app_version;
    postBackInstallAdbrixRemaster.attrType = attr_type;
    postBackInstallAdbrixRemaster.eventName = event_name;
    postBackInstallAdbrixRemaster.eventDatetime = event_datetime;
    postBackInstallAdbrixRemaster.deeplinkPath = deeplink_path;
    postBackInstallAdbrixRemaster.marketInstallBtnClicked = market_install_btn_clicked;
    postBackInstallAdbrixRemaster.appInstallStart = app_install_start;
    postBackInstallAdbrixRemaster.appInstallCompleted = app_install_completed;
    postBackInstallAdbrixRemaster.appFirstOpen = app_first_open;
    postBackInstallAdbrixRemaster.secondsGap = seconds_gap;
    postBackInstallAdbrixRemaster.cb1 = cb_1;
    postBackInstallAdbrixRemaster.cb2 = cb_2;
    postBackInstallAdbrixRemaster.cb3 = cb_3;
    postBackInstallAdbrixRemaster.cb4 = cb_4;
    postBackInstallAdbrixRemaster.cb5 = cb_5;
    postBackInstallAdbrixRemaster.pbUrl = originalUrl;

    const postBackInstallAdbrixRemasterEntity: PostBackInstallAdbrixRemaster = await this.postBackInstallAdbrixRemasterRepository.save(
      postBackInstallAdbrixRemaster,
    );

    if (campaign.cpStatus) {
      const convertedPostbackInstallUrlTemplate = media.mediaPostbackInstallUrlTemplate
        .replace('{click_id}', cb_3)
        .replace('{device_id}', query.adid)
        .replace(
          '{android_device_id}',
          Number(device_platform) == 1 ? device_platform : '',
        )
        .replace(
          '{ios_device_id}',
          Number(device_platform) != 1 ? device_platform : '',
        )
        .replace('{install_timestamp}', event_datetime);
      if (
        campaign &&
        campaign.postBackEvent &&
        campaign.postBackEvent[0].sendPostback === true
      ) {
        await this.httpService
          .get(convertedPostbackInstallUrlTemplate)
          .toPromise()
          .then(() => {
            postBackInstallAdbrixRemasterEntity.isSendDate = new Date();
          })
          .catch();

        await this.postBackInstallAdbrixRemasterRepository.save(
          postBackInstallAdbrixRemasterEntity,
        );
      }
    }

    subMediaEntity.install = Number(subMediaEntity.install) + 1;
    await this.subMediaRepository.save(subMediaEntity);

    return;
  }

  async postBackEventAdbrixRemaster(
    req: any,
    query: AdbrixRemasterPostbackEventDto,
  ) {
    const originalUrl: string = `${req.protocol}://${req.get('host')}${
      req.originalUrl
    }` as string;

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
    } = query;

    const subMediaEntity: SubMedia = await this.subMediaRepository
      .createQueryBuilder('subMedia')
      .leftJoinAndSelect('subMedia.advertising', 'advertising')
      .leftJoinAndSelect('subMedia.campaign', 'campaign')
      .leftJoinAndSelect('subMedia.media', 'media')
      .leftJoinAndSelect('advertising.tracker', 'tracker')
      .leftJoinAndSelect('campaign.postBackEvent', 'postBackEvent')
      .where('subMedia.viewCode =:viewCode', {
        viewCode: cb_2,
      })
      .andWhere('subMedia.cpToken =:cpToken', { cpToken: cb_1 })
      .andWhere('postBackEvent.trackerPostBack =:trackerPostBack', {
        trackerPostBack: event_name,
      })
      .andWhere('advertising.adStatus =:adStatus', { adStatus: true })
      .getOne();

    if (!subMediaEntity) {
      throw new NotFoundException();
    }

    const { campaign, media } = subMediaEntity;
    const postBackEventAdbrixRemaster: PostBackEventAdbrixRemaster = new PostBackEventAdbrixRemaster();
    postBackEventAdbrixRemaster.cpToken = cb_1;
    postBackEventAdbrixRemaster.aKey = a_key;
    postBackEventAdbrixRemaster.aCookie = a_cookie;
    postBackEventAdbrixRemaster.aIp = a_ip;
    postBackEventAdbrixRemaster.aFp = a_fp;
    postBackEventAdbrixRemaster.aCountry = a_country;
    postBackEventAdbrixRemaster.aCity = a_city;
    postBackEventAdbrixRemaster.aRegion = a_region;
    postBackEventAdbrixRemaster.aAppkey = a_appkey;
    postBackEventAdbrixRemaster.mPublisher = m_publisher;
    postBackEventAdbrixRemaster.mSubPublisher = m_sub_publisher;
    postBackEventAdbrixRemaster.attrAdid = attr_adid;
    postBackEventAdbrixRemaster.attrEventDatetime = attr_event_datetime;
    postBackEventAdbrixRemaster.attrEventTimestamp = attr_event_timestamp;
    postBackEventAdbrixRemaster.attrSecondsGap = attr_seconds_gap;
    postBackEventAdbrixRemaster.adid = adid;
    postBackEventAdbrixRemaster.idfv = idfv;
    postBackEventAdbrixRemaster.adIdOptOut = ad_id_opt_out;
    postBackEventAdbrixRemaster.deviceOsVersion = device_os_version;
    postBackEventAdbrixRemaster.deviceModel = device_model;
    postBackEventAdbrixRemaster.deviceVendor = device_vendor;
    postBackEventAdbrixRemaster.deviceResolution = device_resolution;
    postBackEventAdbrixRemaster.devicePortrait = device_portrait;
    postBackEventAdbrixRemaster.devicePlatform = device_platform;
    postBackEventAdbrixRemaster.deviceNetwork = device_network;
    postBackEventAdbrixRemaster.deviceWifi = device_wifi;
    postBackEventAdbrixRemaster.deviceCarrier = device_carrier;
    postBackEventAdbrixRemaster.deviceLanguage = device_language;
    postBackEventAdbrixRemaster.deviceCountry = device_country;
    postBackEventAdbrixRemaster.deviceBuildId = device_build_id;
    postBackEventAdbrixRemaster.packageName = package_name;
    postBackEventAdbrixRemaster.appkey = appkey;
    postBackEventAdbrixRemaster.sdkVersion = sdk_version;
    postBackEventAdbrixRemaster.installer = installer;
    postBackEventAdbrixRemaster.appVersion = app_version;
    postBackEventAdbrixRemaster.eventName = event_name;
    postBackEventAdbrixRemaster.eventDatetime = event_datetime;
    postBackEventAdbrixRemaster.eventTimestamp = event_timestamp;
    postBackEventAdbrixRemaster.eventTimestampD = event_timestamp_d;
    postBackEventAdbrixRemaster.paramJson = param_json;
    postBackEventAdbrixRemaster.cb1 = cb_1;
    postBackEventAdbrixRemaster.cb2 = cb_2;
    postBackEventAdbrixRemaster.cb3 = cb_3;
    postBackEventAdbrixRemaster.cb4 = cb_4;
    postBackEventAdbrixRemaster.cb5 = cb_5;
    postBackEventAdbrixRemaster.pbUrl = originalUrl;

    const postBackEventAdbrixRemasterEntity: PostBackEventAdbrixRemaster = await this.postBackEventAdbrixRemasterRepository.save(
      postBackEventAdbrixRemaster,
    );

    if (campaign.cpStatus === true) {
      const paramJsonData: any = JSON.parse(param_json);

      let event_value: number;
      if (paramJsonData['abx:item.abx:sales']) {
        event_value = paramJsonData['abx:item.abx:sales'];
      } else if (paramJsonData['abx:items']) {
        for (const item of paramJsonData['abx:items']) {
          event_value += item['abx:sales'];
        }
      }
      const convertedPostbackEventUrlTemplate = media.mediaPostbackEventUrlTemplate
        .replace('{click_id}', cb_3)
        .replace('{event_name}', event_name)
        .replace('{event_value}', event_value.toString())
        .replace('{device_id}', adid)
        .replace(
          '{android_device_id}',
          Number(device_platform) == 1 ? device_platform : '',
        )
        .replace(
          '{ios_device_id}',
          Number(device_platform) != 1 ? device_platform : '',
        )
        .replace('{install_timestamp}', '')
        .replace('{event_timestamp}', event_datetime);

      if (
        campaign &&
        campaign.postBackEvent &&
        campaign.postBackEvent[0].sendPostback === true
      ) {
        await this.httpService
          .get(convertedPostbackEventUrlTemplate)
          .toPromise()
          .then(() => {
            postBackEventAdbrixRemasterEntity.isSendDate = new Date();
          })
          .catch();

        await this.postBackEventAdbrixRemasterRepository.save(
          postBackEventAdbrixRemasterEntity,
        );
      }
    }

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne(
      {
        where: { campaign: campaign, trackerPostback: event_name },
      },
    );

    if (postBackEventEntity) {
      switch (postBackEventEntity.adminPostback) {
        case 'install':
          subMediaEntity.install = Number(subMediaEntity.install) + 1;
          break;
        case 'signup':
          subMediaEntity.signup = Number(subMediaEntity.signup) + 1;
          break;
        case 'retention':
          subMediaEntity.retention = Number(subMediaEntity.retention) + 1;
          break;
        case 'buy':
          subMediaEntity.buy = Number(subMediaEntity.buy) + 1;
          break;
        case 'etc1':
          subMediaEntity.etc1 = Number(subMediaEntity.etc1) + 1;
          break;
        case 'etc2':
          subMediaEntity.etc2 = Number(subMediaEntity.etc2) + 1;
          break;
        case 'etc3':
          subMediaEntity.etc3 = Number(subMediaEntity.etc3) + 1;
          break;
        case 'etc4':
          subMediaEntity.etc4 = Number(subMediaEntity.etc4) + 1;
          break;
        case 'etc5':
          subMediaEntity.etc5 = Number(subMediaEntity.etc5) + 1;
          break;
      }

      await this.subMediaRepository.save(subMediaEntity);
    }
    return;
  }
}
