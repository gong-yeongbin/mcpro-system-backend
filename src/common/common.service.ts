import { Injectable, NotFoundException } from '@nestjs/common';
import { getManager, Repository } from 'typeorm';
import { RedisService } from 'nestjs-redis';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Campaign, PostbackDaily, PostbackUnregisteredEvent, PostbackRegisteredEvent } from '../entities/Entity';
import { HttpService } from '@nestjs/common';

@Injectable()
export class CommonService {
  constructor(
    private httpService: HttpService,
    private readonly redisService: RedisService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostbackDaily)
    private readonly postbackDailyRepository: Repository<PostbackDaily>,
    @InjectRepository(PostbackUnregisteredEvent)
    private readonly postbackUnregisteredEventRepository: Repository<PostbackUnregisteredEvent>,
  ) {}

  async installCount(postbackDaily: PostbackDaily): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.install = +postbackDaily.install + 1;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async signupCount(postbackDaily: PostbackDaily, price: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.registration = +postbackDaily.registration + 1;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async retentionCount(postbackDaily: PostbackDaily, price: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.retention = +postbackDaily.retention + 1;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async buyCount(postbackDaily: PostbackDaily, price: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.purchase = +postbackDaily.purchase + 1;
      postbackDaily.revenue = +postbackDaily.revenue + price;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async etc1Count(postbackDaily: PostbackDaily, price: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.etc1 = +postbackDaily.etc1 + 1;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async etc2Count(postbackDaily: PostbackDaily, price: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.etc2 = +postbackDaily.etc2 + 1;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async etc3Count(postbackDaily: PostbackDaily, price: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.etc3 = +postbackDaily.etc3 + 1;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async etc4Count(postbackDaily: PostbackDaily, price: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.etc4 = +postbackDaily.etc4 + 1;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async etc5Count(postbackDaily: PostbackDaily, price: number): Promise<void> {
    await getManager().transaction(async (transactionalEntityManager) => {
      postbackDaily.etc5 = +postbackDaily.etc5 + 1;
      await transactionalEntityManager.getRepository(PostbackDaily).save(postbackDaily);
    });
  }

  async dailyPostbackCountUp(postbackDailyEntity: PostbackDaily, postbackEventEntity: PostbackRegisteredEvent, price?: number): Promise<PostbackDaily> {
    switch (postbackEventEntity.admin) {
      case 'install':
        postbackDailyEntity.install = +postbackDailyEntity.install + 1;
        break;
      case 'signup':
        postbackDailyEntity.revenue = +postbackDailyEntity.revenue + 1;
        break;
      case 'retention':
        postbackDailyEntity.retention = +postbackDailyEntity.retention + 1;
        break;
      case 'buy':
        postbackDailyEntity.purchase = +postbackDailyEntity.purchase + 1;
        postbackDailyEntity.revenue = +postbackDailyEntity.revenue + price;
        break;
      case 'etc1':
        postbackDailyEntity.etc1 = +postbackDailyEntity.etc1 + 1;
        break;
      case 'etc2':
        postbackDailyEntity.etc2 = +postbackDailyEntity.etc2 + 1;
        break;
      case 'etc3':
        postbackDailyEntity.etc3 = +postbackDailyEntity.etc3 + 1;
        break;
      case 'etc4':
        postbackDailyEntity.etc4 = +postbackDailyEntity.etc4 + 1;
        break;
      case 'etc5':
        postbackDailyEntity.etc5 = +postbackDailyEntity.etc5 + 1;
        break;
    }
    return await this.postbackDailyRepository.save(postbackDailyEntity);
  }

  async postbackUnregisteredEvent(postbackDailyEntity: PostbackDaily, eventName: string): Promise<PostbackUnregisteredEvent> {
    const postbackUnregisteredEventEntity: PostbackUnregisteredEvent = await this.postbackUnregisteredEventRepository.findOne({
      where: {
        eventName: eventName,
        postbackDaily: postbackDailyEntity,
      },
    });

    if (postbackUnregisteredEventEntity) {
      // postbackUnregisteredEventEntity.updatedAt = new Date();

      return await this.postbackUnregisteredEventRepository.save(postbackUnregisteredEventEntity);
    } else {
      const postbackUnregisteredEvent: PostbackUnregisteredEvent = new PostbackUnregisteredEvent();
      postbackUnregisteredEvent.postbackDaily = postbackDailyEntity;
      postbackUnregisteredEvent.eventName = eventName;

      return await this.postbackUnregisteredEventRepository.save(postbackUnregisteredEvent);
    }
  }

  async httpServiceHandler(url: string): Promise<string> {
    let isSendtime: string;

    await this.httpService
      .get(url)
      .toPromise()
      .then(async () => {
        // console.log(`[ mecrosspro ---> media ] install : ${url}`);
        isSendtime = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
      })
      .catch();

    return isSendtime ? isSendtime : '';
  }

  async isValidationPostbackDaily(viewCode: string, token: string): Promise<PostbackDaily> {
    let postbackDailyEntity: PostbackDaily;
    postbackDailyEntity = await this.postbackDailyRepository
      .createQueryBuilder('postbackDaily')
      .where('Date(postbackDaily.createdAt) =:date', { date: moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD') })
      .andWhere('postbackDaily.viewCode =:viewCode', { viewCode: viewCode })
      .getOne();

    if (!postbackDailyEntity) {
      const redis: any = this.redisService.getClient();

      let cursor: number;
      cursor = 0;
      do {
        const data: any = await redis.hscan('view_code', cursor, 'MATCH', `${token}/*`, 'COUNT', 20000);

        cursor = data[0];
        const keys: Array<string> = data[1];
        for (let i = 0; i < keys.length; i++) {
          const isViewCode: string = await redis.hget('view_code', keys[i]);

          if (viewCode === isViewCode) {
            const splitData: Array<string> = keys[i].split('/');
            const pub_id: string = splitData[1];
            const sub_id: string = splitData[2];
            const media_idx: string = splitData[3];

            const campaignEntity: Campaign = await this.campaignRepository.findOne({
              where: {
                token: token,
                media: { idx: media_idx },
              },
              relations: ['media'],
            });

            if (!campaignEntity) throw new NotFoundException();

            const postbackDaily = this.postbackDailyRepository.create({
              token: token,
              pubId: pub_id,
              subId: sub_id,
              viewCode: viewCode,
            });

            postbackDailyEntity = await this.postbackDailyRepository.save(postbackDaily);
          }
        }
      } while (cursor != 0);
    }

    return postbackDailyEntity;
  }

  async convertedPostbackInstallUrl(data: {
    uuid: string;
    click_id: string;
    adid: string;
    event_datetime: string;
    click_datetime: string;
    campaignEntity: Campaign;
    postbackDailyEntity: PostbackDaily;
  }): Promise<string> {
    const mediaPostbackInstallUrlTemplate: string = data.campaignEntity.media.mediaPostbackInstallUrlTemplate;
    const platform: string = data.campaignEntity.advertising.platform;
    const click_id: string = data.click_id;
    const adid: string = data.adid;
    const event_datetime: string = data.event_datetime;
    const click_datetime: string = data.click_datetime;
    const pub_id: string = data.postbackDailyEntity.pubId;
    const sub_id: string = data.postbackDailyEntity.subId;
    const uuid: string = data.uuid;

    return mediaPostbackInstallUrlTemplate
      .replace('{click_id}', click_id)
      .replace('{device_id}', adid)
      .replace('{android_device_id}', platform.toLowerCase() == 'aos' ? adid : '')
      .replace('{ios_device_id}', platform.toLowerCase() == 'ios' ? adid : '')
      .replace('{install_timestamp}', event_datetime)
      .replace('{click_datetime', click_datetime)
      .replace('{pub_id}', pub_id)
      .replace('{sub_id}', sub_id)
      .replace('{payout}', '')
      .replace('{uuid}', uuid);
  }

  async convertedPostbackEventUrl(data: {
    uuid: string;
    click_id: string;
    adid: string;
    event_name: string;
    event_datetime: string;
    install_datetime: string;
    campaignEntity: Campaign;
    postbackDailyEntity: PostbackDaily;
  }): Promise<string> {
    const mediaPostbackInstallUrlTemplate: string = data.campaignEntity.media.mediaPostbackEventUrlTemplate;
    const platform: string = data.campaignEntity.advertising.platform;
    const click_id: string = data.click_id;
    const adid: string = data.adid;
    const event_name: string = data.event_name;
    const event_datetime: string = data.event_datetime;
    const install_datetime: string = data.install_datetime;
    const pub_id: string = data.postbackDailyEntity.pubId;
    const sub_id: string = data.postbackDailyEntity.subId;
    const uuid: string = data.uuid;

    return mediaPostbackInstallUrlTemplate
      .replace('{click_id}', click_id)
      .replace('{event_name}', event_name)
      .replace('{event_value}', '')
      .replace('{device_id}', adid)
      .replace('{android_device_id}', platform.toLowerCase() == 'aos' ? adid : '')
      .replace('{ios_device_id}', platform.toLowerCase() == 'ios' ? adid : '')
      .replace('{install_timestamp}', install_datetime)
      .replace('{event_timestamp}', event_datetime)
      .replace('{pub_id}', pub_id)
      .replace('{sub_id}', sub_id)
      .replace('{uuid}', uuid);
  }
}
