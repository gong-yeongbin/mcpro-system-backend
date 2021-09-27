import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostbackController } from './postback.controller';
import { AdbrixremasterService } from './adbrixremaster/adbrixremaster.service';
import { AppsflyerService } from './appsflyer/appsflyer.service';
import { CommonService } from 'src/common/common.service';
import {
  PostbackInstallAppsflyer,
  PostbackEventAppsflyer,
  Campaign,
  PostbackInstallAdbrixremaster,
  PostbackEventAdbrixremaster,
  PostbackRegisteredEvent,
  PostbackUnregisteredEvent,
  PostbackDaily,
} from '../entities/Entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      PostbackDaily,
      PostbackRegisteredEvent,
      PostbackUnregisteredEvent,
      PostbackEventAppsflyer,
      PostbackInstallAppsflyer,
      PostbackInstallAdbrixremaster,
      PostbackEventAdbrixremaster,
    ]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [PostbackController],
  providers: [CommonService, AdbrixremasterService, AppsflyerService],
})
export class PostbackModule {}
