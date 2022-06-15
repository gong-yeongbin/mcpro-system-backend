import { InjectQueue, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job, Queue } from 'bull';
import { Model } from 'mongoose';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { Daily, DailyDocument } from 'src/schema/daily';

@Processor('tracking')
export class TrackingQueue {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Daily.name) private readonly dailyModel: Model<DailyDocument>,
    @InjectQueue('tracking') private readonly trackingQueue: Queue,
  ) {}

  @Process('click')
  async handleClick(job: Job) {
    const token: string = job.data.token;
    const pub_id: string = job.data.pub_id;
    const sub_id: string = job.data.sub_id;
    const impressionCode: string = job.data.impressionCode;

    const redis: Redis = this.redisService.getClient();

    const getClickCount: number = +(await redis.get(`${impressionCode}`));

    if (!getClickCount) {
      await redis.set(`${impressionCode}`, 1);
    } else {
      await redis.incr(`${impressionCode}`);
    }

    // await this.dailyModel.findOneAndUpdate(
    //   {
    //     token: token,
    //     pub_id: pub_id,
    //     sub_id: sub_id,
    //     impressionCode: impressionCode,
    //   },
    //   { $inc: { click: 1 } },
    //   { upsert: true },
    // );
  }
}
