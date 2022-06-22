import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignService } from 'src/campaign/campaign.service';
import { Campaign as Campaign1 } from 'src/entities/Entity';
import { CampaignCacheMiddleware } from 'src/middleware/campaign-cache.middleware';
import { ImpressionCodeCacheMiddleware } from 'src/middleware/impressionCode-cache.middleware';
import { TrackingMiddleware } from 'src/middleware/tracking.middleware';
import { TrackingInfoMiddleware } from 'src/middleware/trackingInfo.middleware';
import { Campaign, CampaignSchema } from 'src/schema/campaign';
import { Config, ConfigSchema } from 'src/schema/config';
import { Daily, DailySchema } from 'src/schema/daily';
import { ImpressionCode, ImpressionCodeSchema } from 'src/schema/impressionCode';
import { TrackingInfo, TrackingInfoSchema } from 'src/schema/trackingInfo';
import { TrackingController } from './tracking.controller';
import { TrackingQueue } from './tracking.queue';
import { TrackingService } from './tracking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign1]),
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Daily.name, schema: DailySchema },
      { name: ImpressionCode.name, schema: ImpressionCodeSchema },
      { name: TrackingInfo.name, schema: TrackingInfoSchema },
    ]),
    BullModule.registerQueue({
      name: 'tracking',
    }),
  ],
  controllers: [TrackingController],
  providers: [TrackingService, CampaignService, TrackingQueue],
})
export class TrackingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrackingMiddleware).forRoutes(TrackingController);
    consumer.apply(CampaignCacheMiddleware).forRoutes(TrackingController);
    consumer.apply(ImpressionCodeCacheMiddleware).forRoutes(TrackingController);
    // consumer.apply(TrackingInfoMiddleware).forRoutes(TrackingController);
  }
}
