import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { RedisLockModule } from 'nestjs-simple-redis-lock';
import { PostBackDaily } from 'src/entities/PostBackDaily';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, PostBackDaily]),
    RedisLockModule.register({}),
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
