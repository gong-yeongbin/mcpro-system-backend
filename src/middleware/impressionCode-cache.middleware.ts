import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { ImpressionCode, ImpressionCodeDocument } from 'src/schema/impressionCode';
import { Model } from 'mongoose';

@Injectable()
export class ImpressionCodeCacheMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel(ImpressionCode.name)
    private readonly impressionCodeModel: Model<ImpressionCodeDocument>,
  ) {}

  async use(request: any, response: any, next: NextFunction): Promise<void> {
    const token: string = request.query.token;
    const pub_id: string = request.query.pub_id;
    const sub_id: string = request.query.sub_id;

    const redis: Redis = this.redisService.getClient();

    const viewCode: string = await redis.hget('view_code', `${token}/${pub_id}/${sub_id}`);
    if (!viewCode) await redis.hset('view_code', `${token}/${pub_id}/${sub_id}`, v4().replace(/-/g, ''));

    const impressionCode: string = await redis.get(`${token}:${pub_id}:${sub_id}`);

    if (!impressionCode) await redis.set(`${token}:${pub_id}:${sub_id}`, v4().replace(/-/g, ''));

    await redis.expire(`${token}:${pub_id}:${sub_id}`, 60 * 60 * 24 * 15);

    next();
  }
}
