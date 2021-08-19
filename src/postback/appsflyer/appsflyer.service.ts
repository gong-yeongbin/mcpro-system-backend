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

    const postBackInstallAppsflyer: PostBackInstallAppsflyer = this.postBackInstallAppsflyerRepository.create({
      view_code: req.query.af_siteid,
      token: req.query.af_c_id,
      clickid: req.query.clickid,
      af_siteid: req.query.af_siteid,
      af_c_id: req.query.af_c_id,
      advertising_id: req.query.advertising_id,
      idfa: req.query.idfa,
      idfv: req.query.idfv,
      install_time: req.query.install_time,
      country_code: req.query.country_code,
      language: req.query.language,
      click_time: req.query.click_time,
      device_carrier: req.query.device_carrier,
      device_ip: req.query.device_ip,
      originalUrl: originalUrl,
    });

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(
      postBackInstallAppsflyer.view_code,
      postBackInstallAppsflyer.token,
    );
    postBackDailyEntity.install++;
    await this.postBackDailyRepository.save(postBackDailyEntity);

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: postBackInstallAppsflyer.af_c_id },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: 'install' },
    });

    if (postBackEventEntity.sendPostback) {
      const click_id: string = postBackInstallAppsflyer.clickid;
      const adid: string = postBackInstallAppsflyer.idfa;
      const event_datetime: string = postBackInstallAppsflyer.install_time;

      const url: string = await this.commonService.convertedPostbackInstallUrl({
        click_id: click_id,
        adid: adid,
        event_datetime: event_datetime,
        campaignEntity: campaignEntity,
      });

      postBackInstallAppsflyer.send_time = await this.commonService.httpServiceHandler(url);
    }

    await this.postBackInstallAppsflyerRepository.save(postBackInstallAppsflyer);

    return;
  }

  // appsflyer postback event
  async postBackEventAppsflyer(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.headers.host}${req.url}`);

    console.log(`[ appsflyer ---> mecrosspro ] event : ${originalUrl}`);

    const postBackEventAppsflyer: PostBackEventAppsflyer = this.postbackEventAppsflyerRepository.create({
      view_code: req.query.af_siteid,
      token: req.query.af_c_id,
      clickid: req.query.clickid,
      af_siteid: req.query.af_siteid,
      af_c_id: req.query.af_c_id,
      advertising_id: req.query.advertising_id,
      idfa: req.query.idfa,
      idfv: req.query.idfv,
      install_time: req.query.install_time,
      country_code: req.query.country_code,
      language: req.query.language,
      event_name: req.query.event_name,
      event_revenue_currency: req.query.event_revenue_currency == 'N/A' ? '' : req.query.event_revenue_currency,
      event_revenue: req.query.event_revenue == 'N/A' ? 0 : req.query.event_revenue,
      event_time: req.query.event_time,
      device_carrier: req.query.device_carrier,
      device_ip: req.query.device_ip,
      originalUrl: originalUrl,
    });

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: postBackEventAppsflyer.af_c_id },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: postBackEventAppsflyer.event_name },
    });

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(
      postBackEventAppsflyer.view_code,
      postBackEventAppsflyer.token,
    );

    if (postBackEventEntity) {
      await this.commonService.dailyPostBackCountUp(postBackDailyEntity, postBackEventEntity, +postBackEventAppsflyer.event_revenue);

      if (postBackEventEntity.sendPostback) {
        const click_id: string = postBackEventAppsflyer.clickid;
        const adid: string = postBackEventAppsflyer.idfa;
        const event_name: string = postBackEventAppsflyer.event_name;
        const install_datetime: string = postBackEventAppsflyer.install_time;
        const event_datetime: string = postBackEventAppsflyer.event_time;

        const url: string = await this.commonService.convertedPostbackEventUrl({
          click_id: click_id,
          adid: adid,
          event_name: event_name,
          event_datetime: event_datetime,
          install_datetime: install_datetime,
          campaignEntity: campaignEntity,
        });

        postBackEventAppsflyer.send_time = await this.commonService.httpServiceHandler(url);
      }

      await this.postbackEventAppsflyerRepository.save(postBackEventAppsflyer);
    } else {
      await this.commonService.postBackUnregisteredEvent(postBackDailyEntity, postBackEventAppsflyer.event_name);
    }

    return;
  }
}
