import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { decodeUnicode } from 'src/util';
import { CommonService } from 'src/common/common.service';
import { PostBackDaily, Campaign, PostBackEvent, PostBackEventAppsflyer, PostBackInstallAppsflyer } from '../../entities/Entity';

@Injectable()
export class AppsflyerService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
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

    const uuid: string = ['', undefined, '{uuid}'].includes(req.query.uuid) ? '' : req.query.uuid;

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

    const token: string = postBackInstallAppsflyer.token;
    const viewCode: string = postBackInstallAppsflyer.view_code;

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(viewCode, token);

    if (!postBackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: token },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: 'install' },
    });

    if (postBackEventEntity.sendPostback) {
      const url: string = await this.commonService.convertedPostbackInstallUrl({
        uuid: uuid,
        click_id: postBackInstallAppsflyer.clickid,
        adid: postBackInstallAppsflyer.idfa,
        event_datetime: postBackInstallAppsflyer.install_time,
        click_datetime: postBackInstallAppsflyer.click_time,
        campaignEntity: campaignEntity,
        postBackDailyEntity: postBackDailyEntity,
      });

      postBackInstallAppsflyer.send_time = await this.commonService.httpServiceHandler(url);
      postBackInstallAppsflyer.send_url = url;
    }

    postBackInstallAppsflyer.pubId = postBackDailyEntity.pub_id;
    postBackInstallAppsflyer.subId = postBackDailyEntity.sub_id;
    postBackInstallAppsflyer.media = campaignEntity.media.md_name;

    await this.postBackInstallAppsflyerRepository.save(postBackInstallAppsflyer);

    return;
  }

  // appsflyer postback event
  async postBackEventAppsflyer(req: any) {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.headers.host}${req.url}`);

    console.log(`[ appsflyer ---> mecrosspro ] event : ${originalUrl}`);

    const uuid: string = ['', undefined, '{uuid}'].includes(req.query.uuid) ? '' : req.query.uuid;

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

    const token: string = postBackEventAppsflyer.token;
    const viewCode: string = postBackEventAppsflyer.view_code;

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(viewCode, token);

    if (!postBackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: token },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postBackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: postBackEventAppsflyer.event_name },
    });

    if (!postBackEventEntity) {
      await this.commonService.postBackUnregisteredEvent(postBackDailyEntity, postBackEventAppsflyer.event_name);
    }

    if (postBackEventEntity && postBackEventEntity.sendPostback) {
      const url: string = await this.commonService.convertedPostbackEventUrl({
        uuid: uuid,
        click_id: postBackEventAppsflyer.clickid,
        adid: postBackEventAppsflyer.idfa,
        event_name: postBackEventAppsflyer.event_name,
        event_datetime: postBackEventAppsflyer.event_time,
        install_datetime: postBackEventAppsflyer.install_time,
        campaignEntity: campaignEntity,
        postBackDailyEntity: postBackDailyEntity,
      });

      postBackEventAppsflyer.send_time = await this.commonService.httpServiceHandler(url);
      postBackEventAppsflyer.send_url = url;
    }

    postBackEventAppsflyer.pubId = postBackDailyEntity.pub_id;
    postBackEventAppsflyer.subId = postBackDailyEntity.sub_id;
    postBackEventAppsflyer.media = campaignEntity.media.md_name;

    await this.postbackEventAppsflyerRepository.save(postBackEventAppsflyer);

    return;
  }
}
