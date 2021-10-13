import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { decodeUnicode } from 'src/util';
import { CommonService } from 'src/common/common.service';
import {
  PostbackDaily,
  Campaign,
  PostbackRegisteredEvent,
  PostbackEventAppsflyer,
  PostbackInstallAppsflyer,
  PostbackUnregisteredEvent,
} from '../entities/Entity';
import { AppsflyerInstallDto } from './dto/appsflyer-install.dto';

@Injectable()
export class AppsflyerService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostbackRegisteredEvent)
    private readonly postbackRegisteredEventRepository: Repository<PostbackRegisteredEvent>,
    @InjectRepository(PostbackUnregisteredEvent)
    private readonly postbackUnregisteredEventRepository: Repository<PostbackUnregisteredEvent>,
    @InjectRepository(PostbackInstallAppsflyer)
    private readonly postbackInstallAppsflyerRepository: Repository<PostbackInstallAppsflyer>,
    @InjectRepository(PostbackEventAppsflyer)
    private readonly postbackEventAppsflyerRepository: Repository<PostbackEventAppsflyer>,
  ) {}

  // appsflyer postback install
  async postbackInstallAppsflyer(request: any, query: AppsflyerInstallDto): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);

    console.log(`[ appsflyer ---> mecrosspro ] install : ${originalUrl}`);

    query.uuid = ['', undefined, '{uuid}'].includes(query.uuid) ? '' : query.uuid;

    const postbackInstallAppsflyer: PostbackInstallAppsflyer = this.postbackInstallAppsflyerRepository.create({
      viewCode: query.af_siteid,
      token: query.af_c_id,
      clickid: query.clickid,
      afSiteid: query.af_siteid,
      afCId: query.af_c_id,
      advertisingId: query.advertising_id,
      idfa: query.idfa,
      idfv: query.idfv,
      installTime: query.install_time,
      countryCode: query.country_code,
      language: query.language,
      clickTime: query.click_time,
      deviceCarrier: query.device_carrier,
      deviceIp: query.device_ip,
      originalUrl: originalUrl,
    });

    const postbackDailyEntity: PostbackDaily = await this.commonService.isValidationPostbackDaily(query.af_siteid, query.af_c_id);

    if (!postbackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.media', 'media')
      .leftJoinAndSelect('campaign.advertising', 'advertising')
      .where('campaign.token =:token', { token: query.af_c_id })
      .getOne();

    if (!campaignEntity) throw new NotFoundException();

    const postbackRegisteredEventEntity: PostbackRegisteredEvent = await this.postbackRegisteredEventRepository
      .createQueryBuilder('postbackRegisteredEvent')
      .where('postbackRegisteredEvent.token =:token', { token: query.af_c_id })
      .andWhere('postbackRegisteredEvent.admin =:event', { event: 'install' })
      .getOne();

    if (postbackRegisteredEventEntity.status) {
      const url: string = await this.commonService.convertedPostbackInstallUrl({
        uuid: query.uuid,
        click_id: postbackInstallAppsflyer.clickid,
        adid: postbackInstallAppsflyer.idfa,
        event_datetime: postbackInstallAppsflyer.installTime,
        click_datetime: postbackInstallAppsflyer.clickTime,
        campaignEntity: campaignEntity,
        postbackDailyEntity: postbackDailyEntity,
      });

      postbackInstallAppsflyer.sendTime = await this.commonService.httpServiceHandler(url);
      postbackInstallAppsflyer.sendUrl = url;
    }

    postbackInstallAppsflyer.pubId = postbackDailyEntity.pubId;
    postbackInstallAppsflyer.subId = postbackDailyEntity.subId;
    postbackInstallAppsflyer.media = campaignEntity.media.name;

    await this.postbackInstallAppsflyerRepository.save(postbackInstallAppsflyer);
  }

  // appsflyer postback event
  async postbackEventAppsflyer(req: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${req.protocol}://${req.headers.host}${req.url}`);

    console.log(`[ appsflyer ---> mecrosspro ] event : ${originalUrl}`);

    const uuid: string = ['', undefined, '{uuid}'].includes(req.query.uuid) ? '' : req.query.uuid;

    const postbackEventAppsflyer: PostbackEventAppsflyer = this.postbackEventAppsflyerRepository.create({
      viewCode: req.query.af_siteid,
      token: req.query.af_c_id,
      clickid: req.query.clickid,
      afSiteid: req.query.af_siteid,
      afCId: req.query.af_c_id,
      advertisingId: req.query.advertising_id,
      idfa: req.query.idfa,
      idfv: req.query.idfv,
      installTime: req.query.install_time,
      countryCode: req.query.country_code,
      language: req.query.language,
      eventName: req.query.event_name,
      eventRevenueCurrency: req.query.event_revenue_currency == 'N/A' ? '' : req.query.event_revenue_currency,
      eventRevenue: req.query.event_revenue == 'N/A' ? 0 : req.query.event_revenue,
      eventTime: req.query.event_time,
      deviceCarrier: req.query.device_carrier,
      deviceIp: req.query.device_ip,
      originalUrl: originalUrl,
    });

    const token: string = postbackEventAppsflyer.token;
    const viewCode: string = postbackEventAppsflyer.viewCode;

    const postbackDailyEntity: PostbackDaily = await this.commonService.isValidationPostbackDaily(viewCode, token);

    if (!postbackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { token: token },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postbackEventEntity: PostbackRegisteredEvent = await this.postbackRegisteredEventRepository.findOne({
      where: { token: token, tracker: postbackEventAppsflyer.eventName },
    });

    if (!postbackEventEntity) {
      let postbackUnregisteredEventEntity: PostbackUnregisteredEvent = await this.postbackUnregisteredEventRepository
        .createQueryBuilder('postbackUnregisteredEvent')
        .where('postbackUnregisteredEvent.eventName =:eventName', { eventName: postbackEventAppsflyer.eventName })
        .andWhere('postbackUnregisteredEvent.token =:token', { token: token })
        .andWhere('Date(postbackUnregisteredEvent.createdAt) =:date', { date: moment().tz('Asia/Seoul').format('YYYY-MM-DD') })
        .getOne();

      postbackUnregisteredEventEntity
        ? ++postbackUnregisteredEventEntity.eventCount
        : (postbackUnregisteredEventEntity = this.postbackUnregisteredEventRepository.create({
            eventName: postbackEventAppsflyer.eventName,
            token: campaignEntity,
          }));

      await this.postbackUnregisteredEventRepository.save(postbackUnregisteredEventEntity);
    }

    if (postbackEventEntity && postbackEventEntity.status) {
      const url: string = await this.commonService.convertedPostbackEventUrl({
        uuid: uuid,
        click_id: postbackEventAppsflyer.clickid,
        adid: postbackEventAppsflyer.idfa,
        event_name: postbackEventAppsflyer.eventName,
        event_datetime: postbackEventAppsflyer.eventTime,
        install_datetime: postbackEventAppsflyer.installTime,
        campaignEntity: campaignEntity,
        postbackDailyEntity: postbackDailyEntity,
      });

      postbackEventAppsflyer.sendTime = await this.commonService.httpServiceHandler(url);
      postbackEventAppsflyer.sendUrl = url;
    }

    postbackEventAppsflyer.pubId = postbackDailyEntity.pubId;
    postbackEventAppsflyer.subId = postbackDailyEntity.subId;
    postbackEventAppsflyer.media = campaignEntity.media.name;

    await this.postbackEventAppsflyerRepository.save(postbackEventAppsflyer);

    return;
  }
}
