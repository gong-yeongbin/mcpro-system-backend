import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import PostbackInstallAdbrixremaster from '@entities/PostbackInstallAdbrixremaster';
import { Repository } from 'typeorm';
import { PostbackEventAdbrixremaster } from '@entities/Entity';
import * as _ from 'lodash';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Processor('adbrixremaster')
export class AdbrixremasterEventConsumer {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackEventAdbrixremaster) private readonly postbackEventAdbrixremasterRepository: Repository<PostbackEventAdbrixremaster>,
  ) {}

  @Process('event')
  async eventHandler(job: Job) {
    const redis: Redis = this.redisService.getClient();

    const postbackEventAdbrixremaster: PostbackEventAdbrixremaster = job.data;
    try {
      if (postbackEventAdbrixremaster.paramJson != 'null' && postbackEventAdbrixremaster.paramJson != '' && postbackEventAdbrixremaster.paramJson != null) {
        const jsonData: any = JSON.parse(postbackEventAdbrixremaster.paramJson);

        if (jsonData['abx:item.abx:sales']) {
          postbackEventAdbrixremaster.revenue = +jsonData['abx:item.abx:sales'];
          postbackEventAdbrixremaster.currency = jsonData['abx:item.abx:currency'];
        } else if (jsonData['abx:items']) {
          for (const item of jsonData['abx:items']) {
            postbackEventAdbrixremaster.revenue += +item['abx:sales'] ? +item['abx:sales'] : 0;
            postbackEventAdbrixremaster.currency = item['abx:currency'];
          }
        }
      }

      let cursor: number;
      cursor = 0;

      do {
        const scanData: [string, string[]] = await redis.hscan('view_code', cursor, 'MATCH', `${postbackEventAdbrixremaster.token}/*`, 'COUNT', 10000);

        cursor = +scanData[0];
        const data: string[] = scanData[1];
        for (let index = 0; index < data.length; index++) {
          if (index % 2 && data[index] == postbackEventAdbrixremaster.viewCode) {
            postbackEventAdbrixremaster.pubId = data[index - 1].split('/')[1];
            postbackEventAdbrixremaster.subId = data[index - 1].split('/')[2];
            cursor = 0;
          }
        }
      } while (cursor != 0);

      await this.postbackEventAdbrixremasterRepository.save(postbackEventAdbrixremaster);
    } catch (error) {
      console.log('error : ', error);
    }
  }
}
