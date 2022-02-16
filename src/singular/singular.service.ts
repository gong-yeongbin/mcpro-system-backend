import { Injectable } from '@nestjs/common';
import { decodeUnicode } from 'src/util';
import { RedisService } from 'nestjs-redis';
import * as moment from 'moment-timezone';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { PostbackInstallSingular, PostbackEventSingular } from '@entities/Entity';
import { Repository } from 'typeorm';

@Injectable()
export class SingularService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackInstallSingular) private readonly postbackInstallSingularRepository: Repository<PostbackInstallSingular>,
    @InjectRepository(PostbackEventSingular) private readonly postbackEventSingularRepository: Repository<PostbackEventSingular>,
  ) {}

  async postbackInstallSingular(request: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ singular ---> mecrosspro ] install : ${originalUrl}`);

    const postbackIntallSingular: PostbackInstallSingular = this.postbackInstallSingularRepository.create({
      viewCode: request.query.sub2,
      token: request.query.sub1,
      attributionIp: request.query.attributionIp,
      osVersion: request.query.osVersion,
      appVersion: request.query.appVersion,
      idfa: request.query.idfa,
      idfv: request.query.idfv,
      gaid: request.query.gaid,
      attributionCountry: request.query.attributionCountry,
      platform: request.query.platform,
      time: request.query.time,
      utc: request.query.utc,
      clickTime: request.query.clickTime,
      clickUtc: request.query.clickUtc,
      sub1: request.query.sub1,
      sub2: request.query.sub2,
      sub3: request.query.sub3,
      sub4: request.query.sub4,
      sub5: request.query.sub5,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('singular:install', date, JSON.stringify(postbackIntallSingular));
  }

  async postbackEventSingular(request: any): Promise<void> {
    const originalUrl: string = decodeUnicode(`${request.protocol}://${request.headers.host}${request.url}`);
    console.log(`[ singular ---> mecrosspro ] event : ${originalUrl}`);

    const postbackEventSingular: PostbackEventSingular = this.postbackEventSingularRepository.create({
      viewCode: request.query.sub2,
      token: request.query.sub1,
      attributionIp: request.query.attributionIp,
      osVersion: request.query.osVersion,
      appVersion: request.query.appVersion,
      idfa: request.query.idfa,
      idfv: request.query.idfv,
      gaid: request.query.gaid,
      attributionCountry: request.query.attributionCountry,
      platform: request.query.platform,
      amount: request.query.amount,
      currency: request.query.currency,
      eventName: request.query.eventName,
      eventAttrs: request.query.eventAttrs,
      time: request.query.time,
      utc: request.query.utc,
      clickTime: request.query.clickTime,
      clickUtc: request.query.clickUtc,
      sub1: request.query.sub1,
      sub2: request.query.sub2,
      sub3: request.query.sub3,
      sub4: request.query.sub4,
      sub5: request.query.sub5,
      originalUrl: originalUrl,
    });

    const date: string = moment().tz('Asia/Seoul').format('YYYY-MM-DD.HH:mm:ss.SSSSS');

    const redis: Redis = this.redisService.getClient();
    await redis.hset('singular:event', date, JSON.stringify(postbackEventSingular));
  }
}
