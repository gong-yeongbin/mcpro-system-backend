import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RedisService } from 'nestjs-redis';
import { RedisLockService } from 'nestjs-simple-redis-lock';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { Campaign, PostBackDaily, PostBackUnregisteredEvent, PostBackEvent } from '../entities/Entity';

@Injectable()
export class CommonService {
  constructor(
    private readonly redisService: RedisService,
    private readonly lockService: RedisLockService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(PostBackDaily)
    private readonly postBackDailyRepository: Repository<PostBackDaily>,
    @InjectRepository(PostBackUnregisteredEvent)
    private readonly postBackUnregisteredEventRepository: Repository<PostBackUnregisteredEvent>,
  ) {}

  async createPostBackDaily(view_code: string, cp_token: string): Promise<PostBackDaily> {
    let postBackDailyEntity: PostBackDaily;
    try {
      await this.lockService.lock(moment().format('YYYYMMDD'), 2 * 60 * 1000, 50, 50);

      const redis: any = this.redisService.getClient();

      let cursor: number;
      cursor = 0;
      do {
        const data: any = await redis.hscan('view_code', cursor, 'MATCH', `${cp_token}/*`, 'COUNT', 20000);

        cursor = data[0];
        const keys: Array<string> = data[1];
        for (let i = 0; i < keys.length; i++) {
          const isViewCode: string = await redis.hget('view_code', keys[i]);

          if (view_code === isViewCode) {
            const splitData: Array<string> = keys[i].split('/');
            const pub_id: string = splitData[1];
            const sub_id: string = splitData[2];
            const media_idx: string = splitData[3];

            const campaignEntity: Campaign = await this.campaignRepository.findOne({
              where: {
                cp_token: cp_token,
                media: { idx: media_idx },
              },
              relations: ['media'],
            });

            if (!campaignEntity) throw new NotFoundException();

            const postBackDaily: PostBackDaily = new PostBackDaily();
            postBackDaily.cp_token = cp_token;
            postBackDaily.pub_id = pub_id;
            postBackDaily.sub_id = sub_id;
            postBackDaily.view_code = view_code;
            postBackDaily.campaign = campaignEntity;

            postBackDailyEntity = await this.postBackDailyRepository.save(postBackDaily);
          }
        }
      } while (cursor != 0);
    } finally {
      this.lockService.unlock(moment().format('YYYYMMDD'));
    }
    return postBackDailyEntity;
  }

  async dailyPostBackCountUp(postBackDailyEntity: PostBackDaily, postBackEventEntity: PostBackEvent, price?: number): Promise<PostBackDaily> {
    switch (postBackEventEntity.adminPostback) {
      case 'install':
        postBackDailyEntity.install = +postBackDailyEntity.install + 1;
        break;
      case 'signup':
        postBackDailyEntity.signup = +postBackDailyEntity.signup + 1;
        break;
      case 'retention':
        postBackDailyEntity.retention = +postBackDailyEntity.retention + 1;
        break;
      case 'buy':
        postBackDailyEntity.buy = +postBackDailyEntity.buy + 1;
        postBackDailyEntity.price = +postBackDailyEntity.price + price;
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
    return await this.postBackDailyRepository.save(postBackDailyEntity);
  }

  async postBackUnregisteredEvent(postBackDailyEntity: PostBackDaily, event_name: string): Promise<PostBackUnregisteredEvent> {
    const postBackUnregisteredEventEntity: PostBackUnregisteredEvent = await this.postBackUnregisteredEventRepository.findOne({
      where: {
        event_name: event_name,
        postBackDaily: postBackDailyEntity,
      },
    });

    if (postBackUnregisteredEventEntity) {
      postBackUnregisteredEventEntity.event_count = +postBackUnregisteredEventEntity.event_count + 1;

      return await this.postBackUnregisteredEventRepository.save(postBackUnregisteredEventEntity);
    } else {
      const postBackUnregisteredEvent: PostBackUnregisteredEvent = new PostBackUnregisteredEvent();
      postBackUnregisteredEvent.postBackDaily = postBackDailyEntity;
      postBackUnregisteredEvent.event_name = event_name;

      return await this.postBackUnregisteredEventRepository.save(postBackUnregisteredEvent);
    }
  }
}
