import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppsflyerController } from './appsflyer.controller';
import { AppsflyerService } from './appsflyer.service';
import { Campaign, PostbackInstallAppsflyer, PostbackEventAppsflyer, PostbackRegisteredEvent, PostbackDaily } from '../entities/Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, PostbackDaily, PostbackRegisteredEvent, PostbackEventAppsflyer, PostbackInstallAppsflyer])],
  controllers: [AppsflyerController],
  providers: [AppsflyerService],
})
export class AppsflyerModule {}
