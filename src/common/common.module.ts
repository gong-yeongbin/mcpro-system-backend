import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisLockModule } from 'nestjs-simple-redis-lock';
import { CommonService } from './common.service';
import { Campaign, PostBackDaily, PostBackUnregisteredEvent } from '../entities/Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, PostBackDaily, PostBackUnregisteredEvent]), RedisLockModule.register({})],
  providers: [CommonService],
})
export class CommonModule {}
