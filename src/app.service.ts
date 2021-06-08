import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { RedisService } from 'nestjs-redis';
import { SubMedia } from 'src/entities/SubMedia';
import { RedisLock, RedisLockService } from 'nestjs-simple-redis-lock';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(SubMedia)
    private readonly subMediaRepository: Repository<SubMedia>,
    private readonly redisService: RedisService,
    protected readonly lockService: RedisLockService,
  ) {}

  getHello(): string {
    return 'Hello World!!';
  }

  @Cron('0 */15 * * * *')
  @RedisLock(moment().format('YYYYMMDD'), 2 * 60 * 1000, 50, 50)
  async redisClickCountCron() {
    console.log('=== redis total click count cron ===');
    const client = this.redisService.getClient();
    const keys: Array<string> = await client.hkeys(moment().format('YYYYMMDD'));
    keys.map(async (value) => {
      const clickCount: string = await client.hget(
        moment().format('YYYYMMDD'),
        value,
      );
      console.log(`===== ${value} : ${clickCount}`);
      const key: Array<string> = value.split('/');
      const subMediaEntity: SubMedia = await this.subMediaRepository
        .createQueryBuilder('subMedia')
        .where('subMedia.cpToken =:cpToken', { cpToken: key[0] })
        .andWhere('subMedia.viewCode =:viewCode', { viewCode: key[1] })
        .andWhere('subMedia.pubId =:pubId', { pubId: key[2] })
        .andWhere('subMedia.subId =:subId', { subId: key[3] })
        .andWhere('Date(subMedia.createdAt) =:createdAt', {
          createdAt: moment().format('YYYY-MM-DD'),
        })
        .getOne();

      if (!subMediaEntity) throw new NotFoundException();

      subMediaEntity.click = subMediaEntity.click + Number(clickCount);
      await this.subMediaRepository.save(subMediaEntity);

      await client.hdel(moment().format('YYYYMMDD'), value);
    });
  }

  @Cron('1 0 * * *')
  @RedisLock(
    moment().subtract('1', 'd').format('YYYYMMDD'),
    2 * 60 * 1000,
    50,
    50,
  )
  async redisClickCountMidnight() {
    console.log('=== redis total click count midnight cron ===');
    const client = this.redisService.getClient();
    const keys: Array<string> = await client.hkeys(
      moment().subtract('1', 'd').format('YYYYMMDD'),
    );
    keys.map(async (value) => {
      const clickCount: string = await client.hget(
        moment().subtract('1', 'd').format('YYYYMMDD'),
        value,
      );
      console.log(`===== ${value} : ${clickCount}`);
      const key: Array<string> = value.split('/');
      const subMediaEntity: SubMedia = await this.subMediaRepository
        .createQueryBuilder('subMedia')
        .where('subMedia.cpToken =:cpToken', { cpToken: key[0] })
        .andWhere('subMedia.viewCode =:viewCode', { viewCode: key[1] })
        .andWhere('subMedia.pubId =:pubId', { pubId: key[2] })
        .andWhere('subMedia.subId =:subId', { subId: key[3] })
        .andWhere('Date(subMedia.createdAt) =:createdAt', {
          createdAt: moment().subtract('1', 'd').format('YYYY-MM-DD'),
        })
        .getOne();

      if (!subMediaEntity) throw new NotFoundException();

      subMediaEntity.click = subMediaEntity.click + Number(clickCount);
      await this.subMediaRepository.save(subMediaEntity);

      await client.hdel(moment().subtract('1', 'd').format('YYYYMMDD'), value);
    });
  }
}
