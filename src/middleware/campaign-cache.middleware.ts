import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { Campaign } from '../entities/Entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CampaignCacheMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async use(request: any, response: any, next: NextFunction): Promise<void> {
    const token: string = request.query.token;

    const redis: Redis = this.redisService.getClient();

    let trackerTrackingUrl = await redis.hget(token, 'trackerTrackingUrl');

    if (!trackerTrackingUrl) {
      const campaignEntity: Campaign = await this.campaignRepository.findOne({
        where: {
          token: token,
          block: false,
        },
      });

      if (!campaignEntity) throw new NotFoundException();

      trackerTrackingUrl = campaignEntity.trackerTrackingUrl;

      await redis.hset(token, 'trackerTrackingUrl', trackerTrackingUrl);
      await redis.expire(token, 60 * 15);
    }

    next();
  }
}
