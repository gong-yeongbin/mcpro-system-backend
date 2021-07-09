import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisLockModule } from 'nestjs-simple-redis-lock';
import { Campaign } from 'src/entities/Campaign';
import { PostBackDaily } from 'src/entities/PostBackDaily';
import { PostBackUnregisteredEvent } from 'src/entities/PostBackUnregisteredEvent';
import { CommonService } from './common.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, PostBackDaily, PostBackUnregisteredEvent]), RedisLockModule.register({})],
  providers: [CommonService],
})
export class CommonModule {}
