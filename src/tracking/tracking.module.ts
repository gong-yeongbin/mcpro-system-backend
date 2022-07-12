import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign as Campaign1 } from 'src/entities/Entity';
import { CampaignCacheMiddleware } from 'src/middleware/campaign-cache.middleware';
import { ImpressionCodeCacheMiddleware } from 'src/middleware/impressionCode-cache.middleware';
import { TrackingMiddleware } from 'src/middleware/tracking.middleware';
import { Campaign, CampaignSchema } from 'src/schema/campaign';
import { Config, ConfigSchema } from 'src/schema/config';
import { Daily, DailySchema } from 'src/schema/daily';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { BullModule } from '@nestjs/bull';
import { ImpressionCodeConsumer } from './impressionCode.consumer';
import { ImpressionCode, ImpressionCodeSchema } from 'src/schema/impressionCode';
import { DailyCacheMiddleware } from 'src/middleware/daily-cache.middleware';
import { DailyConsumer } from './daily.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign1]),
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Config.name, schema: ConfigSchema },
      { name: Daily.name, schema: DailySchema },
      { name: ImpressionCode.name, schema: ImpressionCodeSchema },
    ]),
    BullModule.registerQueue({
      name: 'daily',
    }),
    BullModule.registerQueue({
      name: 'impressionCode',
    }),
  ],
  controllers: [TrackingController],
  providers: [TrackingService, ImpressionCodeConsumer, DailyConsumer],
})
export class TrackingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrackingMiddleware).forRoutes(TrackingController);
    consumer.apply(CampaignCacheMiddleware).forRoutes(TrackingController);
    consumer.apply(ImpressionCodeCacheMiddleware).forRoutes(TrackingController);
    consumer.apply(DailyCacheMiddleware).forRoutes(TrackingController);
  }
}
