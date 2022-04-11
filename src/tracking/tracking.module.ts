import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Entity';
import { TrackingMiddleware } from 'src/middleware/trackingMiddleware';
import { Config, ConfigSchema } from 'src/schema/Config';
import { TrackingInfo, TrackingInfoSchema } from 'src/schema/TrackingInfo';
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
  }
}
