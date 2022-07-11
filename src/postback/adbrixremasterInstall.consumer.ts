import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { PostbackInstallAdbrixremaster } from '@entities/Entity';

@Processor('adbrixremasterInstall')
export class AdbrixremasterInstallConsumer {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(PostbackInstallAdbrixremaster) private readonly postbackInstallAdbrixremasterRepository: Repository<PostbackInstallAdbrixremaster>,
  ) {}

  @Process()
  async installHandler(job: Job) {
    const postbackInstallAdbrixremaster: PostbackInstallAdbrixremaster = job.data;
    const redis: Redis = this.redisService.getClient();

    try {
      let cursor: number;
      cursor = 0;

      do {
        const scanData: [string, string[]] = await redis.hscan('view_code', cursor, 'MATCH', `${postbackInstallAdbrixremaster.token}/*`, 'COUNT', 10000);

        cursor = +scanData[0];
        const data: string[] = scanData[1];
        for (let index = 0; index < data.length; index++) {
          if (index % 2 && data[index] == postbackInstallAdbrixremaster.viewCode) {
            postbackInstallAdbrixremaster.pubId = data[index - 1].split('/')[1];
            postbackInstallAdbrixremaster.subId = data[index - 1].split('/')[2];
            cursor = 0;
          }
        }
      } while (cursor != 0);

      await this.postbackInstallAdbrixremasterRepository.save(postbackInstallAdbrixremaster);
    } catch (error) {}
  }
}
