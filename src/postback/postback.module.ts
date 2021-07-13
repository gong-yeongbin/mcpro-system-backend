import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostBackEvent } from 'src/entities/PostBackEvent';
import { PostBackEventAppsflyer } from 'src/entities/PostBackEventAppsflyer';
import { PostBackInstallAppsflyer } from 'src/entities/PostBackInstallAppsflyer';
import { PostBackUnregisteredEvent } from 'src/entities/PostBackUnregisteredEvent';
import { PostBackDaily } from 'src/entities/PostBackDaily';
import { PostbackController } from './postback.controller';
import { PostbackService } from './postback.service';
import { RedisLockModule } from 'nestjs-simple-redis-lock';
import { Campaign } from 'src/entities/Campaign';
import { AdbrixremasterService } from './adbrixremaster/adbrixremaster.service';
import { AppsflyerService } from './appsflyer/appsflyer.service';
import { CommonService } from 'src/common/common.service';
import { PostBackInstallAdbrixremaster } from 'src/entities/PostBackInstallAdbrixremaster';
import { PostBackEventAdbrixremaster } from 'src/entities/PostBackEventAdbrixremaster';

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
    RedisLockModule.register({}),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [PostbackController],
  providers: [PostbackService, CommonService, AdbrixremasterService, AppsflyerService],
})
export class PostbackModule {}
