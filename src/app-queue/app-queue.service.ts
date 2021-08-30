import { Process, Processor } from '@nestjs/bull';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { CommonService } from 'src/common/common.service';
import {
  Campaign,
  PostBackDaily,
  PostBackEvent,
  PostBackEventAdbrixremaster,
  PostBackInstallAdbrixremaster,
  PostBackUnregisteredEvent,
} from 'src/entities/Entity';
import { Repository } from 'typeorm';

@Processor('postback')
export class AppQueueService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(Campaign) private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostBackDaily) private readonly postbackDailyRepository: Repository<PostBackDaily>,
    @InjectRepository(PostBackEvent) private readonly postbackEventRepository: Repository<PostBackEvent>,
    @InjectRepository(PostBackInstallAdbrixremaster) private readonly postbackInstallAdbrixremasterRepository: Repository<PostBackInstallAdbrixremaster>,
    @InjectRepository(PostBackEventAdbrixremaster) private readonly postbackEventAdbrixremasterRepository: Repository<PostBackEventAdbrixremaster>,
    @InjectRepository(PostBackUnregisteredEvent) private readonly postbackUnregisteredEventRepository: Repository<PostBackUnregisteredEvent>,
  ) {}

  @Process('install-postback')
  async installPostbackQueue(job: Job) {
    const tracker: string = job.data.tracker;
    const postback: any = job.data.postback;
    const token: string = job.data.token;
    const viewCode: string = job.data.viewCode;
    const clickId: string = job.data.clickId;
    const adid: string = job.data.adid;
    const event_datetime: string = job.data.event_datetime;
    const click_datetime: string = job.data.click_datetime;
    const uuid: string = job.data.uuid;

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(viewCode, token);

    if (!postBackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: token },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postbackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: 'install' },
    });

    if (postBackEventEntity.sendPostback) {
      const url: string = await this.commonService.convertedPostbackInstallUrl({
        uuid: uuid,
        click_id: clickId,
        adid: adid,
        event_datetime: event_datetime,
        click_datetime: click_datetime,
        campaignEntity: campaignEntity,
        postBackDailyEntity: postBackDailyEntity,
      });

      postback.send_time = await this.commonService.httpServiceHandler(url);
      postback.send_url = url;
    }

    const caseTracker = {
      adbrixremaster: this.adbrixreamsterInstall(postback),
    };

    await caseTracker[tracker];

    postBackDailyEntity.install += 1;
    await this.postbackDailyRepository.save(postBackDailyEntity);
  }

  @Process('event-postback')
  async eventPostbackQueue(job: Job) {
    const tracker: string = job.data.tracker;
    const postback: any = job.data.postback;
    const token: string = job.data.token;
    const viewCode: string = job.data.viewCode;
    const clickId: string = job.data.clickId;
    const adid: string = job.data.adid;
    const event_name: string = job.data.event_name;
    const event_datetime: string = job.data.event_datetime;
    const install_datetime: string = job.data.click_datetime;
    const revenue: number = job.data.revenue;
    const uuid: string = job.data.uuid;

    const postBackDailyEntity: PostBackDaily = await this.commonService.isValidationPostbackDaily(viewCode, token);

    if (!postBackDailyEntity) throw new NotFoundException();

    const campaignEntity: Campaign = await this.campaignRepository.findOne({
      where: { cp_token: token },
      relations: ['media', 'advertising'],
    });

    if (!campaignEntity) throw new NotFoundException();

    const postBackEventEntity: PostBackEvent = await this.postbackEventRepository.findOne({
      where: { campaign: campaignEntity, trackerPostback: postback.event_name },
    });

    if (postBackEventEntity && postBackEventEntity.sendPostback) {
      const url: string = await this.commonService.convertedPostbackEventUrl({
        uuid: uuid,
        click_id: clickId,
        adid: adid,
        event_name: event_name,
        event_datetime: event_datetime,
        install_datetime: install_datetime,
        campaignEntity: campaignEntity,
        postBackDailyEntity: postBackDailyEntity,
      });

      postback.send_time = await this.commonService.httpServiceHandler(url);
      postback.send_url = url;
    }

    if (!postBackEventEntity) {
      await this.postBackUnregisteredEvent(postBackDailyEntity, event_name);
    }

    const caseTracker = {
      adbrixremaster: this.adbrixreamsterEvent(postback),
    };

    await caseTracker[tracker];

    switch (postBackEventEntity.adminPostback) {
      case 'signup':
        postBackDailyEntity.signup = +postBackDailyEntity.signup + 1;
        break;
      case 'retention':
        postBackDailyEntity.retention = +postBackDailyEntity.retention + 1;
        break;
      case 'buy':
        postBackDailyEntity.buy = +postBackDailyEntity.buy + 1;
        postBackDailyEntity.price = +postBackDailyEntity.price + revenue;
        break;
      case 'etc1':
        postBackDailyEntity.etc1 = +postBackDailyEntity.etc1 + 1;
        break;
      case 'etc2':
        postBackDailyEntity.etc2 = +postBackDailyEntity.etc2 + 1;
        break;
      case 'etc3':
        postBackDailyEntity.etc3 = +postBackDailyEntity.etc3 + 1;
        break;
      case 'etc4':
        postBackDailyEntity.etc4 = +postBackDailyEntity.etc4 + 1;
        break;
      case 'etc5':
        postBackDailyEntity.etc5 = +postBackDailyEntity.etc5 + 1;
        break;
    }

    await this.postbackDailyRepository.save(postBackDailyEntity);
  }

  async adbrixreamsterInstall(postback: PostBackInstallAdbrixremaster): Promise<PostBackInstallAdbrixremaster> {
    return await this.postbackInstallAdbrixremasterRepository.save(postback);
  }

  async adbrixreamsterEvent(postback: PostBackEventAdbrixremaster): Promise<PostBackEventAdbrixremaster> {
    return await this.postbackEventAdbrixremasterRepository.save(postback);
  }

  async postBackUnregisteredEvent(postBackDailyEntity: PostBackDaily, event_name: string): Promise<PostBackUnregisteredEvent> {
    const postBackUnregisteredEventEntity: PostBackUnregisteredEvent = await this.postbackUnregisteredEventRepository.findOne({
      where: {
        event_name: event_name,
        postBackDaily: postBackDailyEntity,
      },
    });

    if (postBackUnregisteredEventEntity) {
      postBackUnregisteredEventEntity.event_count = +postBackUnregisteredEventEntity.event_count + 1;

      return await this.postbackUnregisteredEventRepository.save(postBackUnregisteredEventEntity);
    } else {
      const postBackUnregisteredEvent: PostBackUnregisteredEvent = new PostBackUnregisteredEvent();
      postBackUnregisteredEvent.postBackDaily = postBackDailyEntity;
      postBackUnregisteredEvent.event_name = event_name;

      return await this.postbackUnregisteredEventRepository.save(postBackUnregisteredEvent);
    }
  }
}
