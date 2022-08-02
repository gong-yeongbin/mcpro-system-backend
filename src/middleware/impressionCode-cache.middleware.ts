import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ImpressionCode, ImpressionCodeDocument } from 'src/schema/impressionCode';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ImpressionCodeCacheMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    @InjectQueue('impressionCode') private readonly impressionCodeQueue: Queue,
    @InjectModel(ImpressionCode.name) private readonly impressionCodeModel: Model<ImpressionCodeDocument>,
  ) {}

  async use(request: any, response: any, next: NextFunction): Promise<void> {
    const token: string = request.query.token;
    const pub_id: string = request.query.pub_id;
    const sub_id: string = request.query.sub_id;

    const redis: Redis = this.redisService.getClient();
    const isImpressionCodeValidation: string = await redis.get(`${token}:${pub_id}:${sub_id}`);

    if (!isImpressionCodeValidation) {
      let viewCode: string = await redis.hget('view_code', `${token}/${pub_id}/${sub_id}`);
      if (!viewCode) {
        viewCode = v4().replace(/-/g, '');
        await redis.hset('view_code', `${token}/${pub_id}/${sub_id}`, viewCode);
      }

      const impressionCodeInstance: ImpressionCode = await this.impressionCodeModel.findOne({ token: token, pub_id: pub_id, sub_id: sub_id }).exec();
      const impressionCode: string = impressionCodeInstance ? impressionCodeInstance.impressionCode : viewCode;

      await this.impressionCodeQueue.add(
        {
          token: token,
          pub_id: pub_id,
          sub_id: sub_id,
          impressionCode: impressionCode,
        },
        { removeOnComplete: true, removeOnFail: true, attempts: 2 },
      );

      await redis.set(`${token}:${pub_id}:${sub_id}`, impressionCode);
      await redis.expire(`${token}:${pub_id}:${sub_id}`, 60 * 60 * 12);
    }

    next();
  }
}
