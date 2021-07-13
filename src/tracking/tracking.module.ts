import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../entities/Entity';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { RedisLockModule } from 'nestjs-simple-redis-lock';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), RedisLockModule.register({})],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
