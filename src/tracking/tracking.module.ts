import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Entity';
import { TrackingMiddleware } from 'src/middleware/tracking.middleware';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign]),
    // MongooseModule.forFeature([
    //   { name: Config.name, schema: ConfigSchema },
    //   { name: TrackingInfo.name, schema: TrackingInfoSchema },
    // ]),
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TrackingMiddleware).forRoutes(TrackingController);
    // consumer.apply(TrackingInfoMiddleware).forRoutes(TrackingController);
  }
}
