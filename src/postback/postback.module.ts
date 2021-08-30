import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostbackController } from './postback.controller';
import { RedisLockModule } from 'nestjs-simple-redis-lock';
import { AdbrixremasterService } from './adbrixremaster/adbrixremaster.service';
import { AppsflyerService } from './appsflyer/appsflyer.service';
import { CommonService } from 'src/common/common.service';
import {
  PostBackInstallAppsflyer,
  PostBackEventAppsflyer,
  Campaign,
  PostBackInstallAdbrixremaster,
  PostBackEventAdbrixremaster,
  PostBackEvent,
  PostBackUnregisteredEvent,
  PostBackDaily,
} from '../entities/Entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      PostBackDaily,
      PostBackEvent,
      PostBackUnregisteredEvent,
      PostBackEventAppsflyer,
      PostBackInstallAppsflyer,
      PostBackInstallAdbrixremaster,
      PostBackEventAdbrixremaster,
    ]),
    BullModule.registerQueue({
      name: 'postback',
    }),
    RedisLockModule.register({}),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [PostbackController],
  providers: [CommonService, AdbrixremasterService, AppsflyerService],
})
export class PostbackModule {}
