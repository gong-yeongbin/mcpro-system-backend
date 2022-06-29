import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Daily, DailyDocument } from 'src/schema/daily';
import * as moment from 'moment-timezone';

@Injectable()
export class ImpressionCodeCacheMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService, @InjectModel(Daily.name) private readonly dailyModel: Model<DailyDocument>) {}

  async use(request: any, response: any, next: NextFunction): Promise<void> {
    const token: string = request.query.token;
    const pub_id: string = request.query.pub_id;
    const sub_id: string = request.query.sub_id;

    const redis: Redis = this.redisService.getClient();

    let viewCode: string = await redis.hget('view_code', `${token}/${pub_id}/${sub_id}`);
    if (!viewCode) {
      viewCode = v4().replace(/-/g, '');
      await redis.hset('view_code', `${token}/${pub_id}/${sub_id}`, viewCode);
    }

    await this.dailyModel.findOneAndUpdate(
      {
        token: token,
        pub_id: pub_id,
        sub_id: sub_id,
        createdAt: {
          $gte: moment().startOf('day').toISOString(),
          $lte: moment().endOf('day').toISOString(),
        },
      },
      { $set: { impressionCode: viewCode } },
      { upsert: true },
    );

    // await this.impressionCodeModel.findOneAndUpdate(
    //   {
    //     token: token,
    //     pub_id: pub_id,
    //     sub_id: sub_id,
    //   },
    //   { token: token, pub_id: pub_id, sub_id: sub_id, impressionCode: viewCode },
    //   { upsert: true },
    // );

    next();
  }
}
