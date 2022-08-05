import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { PostbackDaily } from '@entities/Entity';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';

@Injectable()
export class ImpressionCodeCacheMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackDaily) private readonly postbackDailyRepository: Repository<PostbackDaily>,
  ) {}

  async use(request: any, response: any, next: NextFunction): Promise<void> {
    const token: string = request.query.token;
    const pub_id: string = request.query.pub_id;
    const sub_id: string = request.query.sub_id;

    const redis: Redis = this.redisService.getClient();

    const impressionCode: string = await redis.get(`${token}:${pub_id}:${sub_id}`);

    if (!impressionCode) {
      // let viewCode: string = await redis.hget('view_code', `${token}/${pub_id}/${sub_id}`);
      // if (!viewCode) {
      //   viewCode = v4().replace(/-/g, '');
      //   await redis.hset('view_code', `${token}/${pub_id}/${sub_id}`, viewCode);
      // }
      // await redis.set(`${token}:${pub_id}:${sub_id}`, viewCode);
      // await redis.expire(`${token}:${pub_id}:${sub_id}`, 60 * 60 * 24 * 1);

      const postbackDailyEntity: PostbackDaily = await this.postbackDailyRepository
        .createQueryBuilder('postbackDaily')
        .where('postbackDaily.createdAt >:date AND postbackDaily.createdAt <:date + INTERVAL 1 DAY', {
          date: moment().tz('Asia/Seoul').format('YYYY-MM-DD'),
        })
        .andWhere('postbackDaily.token', { token: token })
        .andWhere('postbackDaily.pubId', { pubId: pub_id })
        .andWhere('postbackDaily.subId', { subId: sub_id })
        .getOne();

      const impressionCode: string = postbackDailyEntity ? postbackDailyEntity.viewCode : v4().replace(/-/g, '');
      await redis.hset('view_code', `${token}/${pub_id}/${sub_id}`, impressionCode);

      await redis.set(`${token}:${pub_id}:${sub_id}`, impressionCode);
      await redis.expire(`${token}:${pub_id}:${sub_id}`, 60 * 60 * 24 * 1);
    }

    next();
  }
}
