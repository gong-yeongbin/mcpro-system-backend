import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  controllers: [AppsflyerController],
  providers: [AppsflyerService],
})
export class AppsflyerModule {}
