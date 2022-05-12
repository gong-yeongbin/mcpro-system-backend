import {
  PostbackEventAdbrixremaster,
  PostbackEventAdjust,
  PostbackEventAirbridge,
  PostbackEventAppsflyer,
  PostbackEventSingular,
  PostbackEventTradingworks,
  PostbackInstallAdbrixremaster,
  PostbackInstallAdjust,
  PostbackInstallAirbridge,
  PostbackInstallAppsflyer,
  PostbackInstallSingular,
  PostbackInstallTradingworks,
} from '@entities/Entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostbackController } from './postback.controller';
import { PostbackService } from './postback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostbackInstallAirbridge,
      PostbackInstallTradingworks,
      PostbackInstallAppsflyer,
      PostbackInstallAdbrixremaster,
      PostbackInstallAdjust,
      PostbackInstallSingular,
      PostbackEventAirbridge,
      PostbackEventTradingworks,
      PostbackEventAppsflyer,
      PostbackEventAdbrixremaster,
      PostbackEventAdjust,
      PostbackEventSingular,
    ]),
  ],
  controllers: [PostbackController],
  providers: [PostbackService],
})
export class PostbackModule {}
