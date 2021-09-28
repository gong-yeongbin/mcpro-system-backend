import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { AppsflyerController } from './appsflyer.controller';
import { AppsflyerService } from './appsflyer.service';
import {
  Campaign,
  PostbackInstallAppsflyer,
  PostbackEventAppsflyer,
  PostbackRegisteredEvent,
  PostbackUnregisteredEvent,
  PostbackDaily,
} from '../entities/Entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, PostbackDaily, PostbackRegisteredEvent, PostbackUnregisteredEvent, PostbackEventAppsflyer, PostbackInstallAppsflyer]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [AppsflyerController],
  providers: [AppsflyerService, CommonService],
})
export class AppsflyerModule {}
