import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Daily, DailyDocument } from 'src/schema/daily';
import { Model } from 'mongoose';

@Injectable()
export class ViewCodeCacheMiddleware implements NestMiddleware {
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

    const daily: string = await redis.get(`${token}:${pub_id}:${sub_id}:createdDaily`);

    if (!daily) {
      await this.dailyModel.findOneAndUpdate(
        { token: token, pub_id: pub_id, sub_id: sub_id },
        { $set: { impressionCode: viewCode } },
        { upsert: true, lean: true },
      );

      await redis.set(`${token}:${pub_id}:${sub_id}:createdDaily`, viewCode);
      await redis.expire(`${token}:${pub_id}:${sub_id}:createdDaily`, 60 * 30);
    }

    next();
  }
}
