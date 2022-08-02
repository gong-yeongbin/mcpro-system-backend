import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class ImpressionCodeCacheMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService, @InjectQueue('impressionCode') private readonly impressionCodeQueue: Queue) {}

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

    const impressionCode: string = await redis.get(`${token}:${pub_id}:${sub_id}`);

    if (!impressionCode) {
      await redis.set(`${token}:${pub_id}:${sub_id}`, viewCode);
      await redis.expire(`${token}:${pub_id}:${sub_id}`, 60 * 60 * 12);

      await this.impressionCodeQueue.add(
        {
          token: token,
          pub_id: pub_id,
          sub_id: sub_id,
          impressionCode: viewCode,
        },
        { removeOnComplete: true, removeOnFail: true, attempts: 2 },
      );
    }

    next();
  }
}
