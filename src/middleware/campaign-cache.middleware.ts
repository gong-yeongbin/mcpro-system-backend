import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';
import { Campaign as Campaign1 } from '../entities/Entity';
import { CampaignService } from 'src/campaign/campaign.service';

@Injectable()
export class CampaignCacheMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService, private readonly campaignService: CampaignService) {}

  async use(request: any, response: any, next: NextFunction): Promise<void> {
    const token: string = request.query.token;

    const redis: Redis = this.redisService.getClient();

    let trackerTrackingUrl = await redis.hget(token, 'trackerTrackingUrl');

    if (!trackerTrackingUrl) {
      // const campaignInstance: Campaign = await this.campaignService.getCampaign(token);
      const campaignEntity: Campaign1 = await this.campaignService.getCampaign(token);

      // trackerTrackingUrl = campaignInstance.trackerTrackingUrl;
      trackerTrackingUrl = campaignEntity.trackerTrackingUrl;

      await redis.hset(token, 'trackerTrackingUrl', trackerTrackingUrl);
      await redis.expire(token, 60 * 60);
    }

    next();
  }
}
