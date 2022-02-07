import { Injectable } from '@nestjs/common';
import { decodeUnicode } from 'src/util';
import { RedisService } from 'nestjs-redis';
import * as moment from 'moment-timezone';
import { Redis } from 'ioredis';

@Injectable()
export class SingularService {
  constructor(private readonly redisService: RedisService) {}

  async postbackInstallSingular(request: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ singular ---> mecrosspro ] install : ${originalUrl}`);

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('singular:install', date, JSON.stringify(originalUrl));
  }

  async postbackEventSingular(request: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ singular ---> mecrosspro ] event : ${originalUrl}`);

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('singular:event', date, JSON.stringify(originalUrl));
  }
}
