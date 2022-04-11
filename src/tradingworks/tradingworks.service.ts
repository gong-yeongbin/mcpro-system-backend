import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as moment from 'moment-timezone';
import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { decodeUnicode } from 'src/util';

@Injectable()
export class TradingworksService {
  constructor(private readonly redisService: RedisService) {}

  async install(request: Request): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ tradingworks ---> mecrosspro ] install : ${originalUrl}`);

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('tradingworks:install', date, JSON.stringify(originalUrl));
  }

  async event(request: Request): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ tradingworks ---> mecrosspro ] event : ${originalUrl}`);

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('tradingworks:event', date, JSON.stringify(originalUrl));
  }
}
