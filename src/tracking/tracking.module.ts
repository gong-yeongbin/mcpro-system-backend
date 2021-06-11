import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { RedisLockModule } from 'nestjs-simple-redis-lock';
import { SubMedia } from 'src/entities/SubMedia';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, SubMedia]),
    RedisLockModule.register({}),
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
