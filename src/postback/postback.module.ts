import {
  PostbackEventAdbrixremaster,
  PostbackEventAdjust,
  PostbackEventAirbridge,
  PostbackEventAppsflyer,
  PostbackEventMobiconnect,
  PostbackEventSingular,
  PostbackEventTradingworks,
  PostbackInstallAdbrixremaster,
  PostbackInstallAdjust,
  PostbackInstallAirbridge,
  PostbackInstallAppsflyer,
  PostbackInstallMobiconnect,
  PostbackInstallSingular,
  PostbackInstallTradingworks,
} from '@entities/Entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirbridgeEvent, AirbridgeEventSchema } from 'src/schema/airbridge_event';
import { AirbridgeInstall, AirbridgeInstallSchema } from 'src/schema/airbridge_install';
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
      PostbackInstallMobiconnect,
      PostbackEventAirbridge,
      PostbackEventTradingworks,
      PostbackEventAppsflyer,
      PostbackEventAdbrixremaster,
      PostbackEventAdjust,
      PostbackEventSingular,
      PostbackEventMobiconnect,
    ]),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([
      { name: AirbridgeInstall.name, schema: AirbridgeInstallSchema },
      { name: AirbridgeEvent.name, schema: AirbridgeEventSchema },
    ]),
  ],
  controllers: [PostbackController],
  providers: [PostbackService],
})
export class PostbackModule {}
