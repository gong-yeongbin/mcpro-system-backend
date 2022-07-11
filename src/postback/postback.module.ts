import {
  PostbackDaily,
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
  PostbackRegisteredEvent,
} from '@entities/Entity';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdbrixremasterEvent, AdbrixremasterEventSchema } from 'src/schema/adbrixremaster_event';
import { AdbrixremasterInstall, AdbrixremasterInstallSchema } from 'src/schema/adbrixremaster_install';
import { AdjustEvent, AdjustEventSchema } from 'src/schema/adjust_event';
import { AdjustInstall, AdjustInstallSchema } from 'src/schema/adjust_install';
import { AirbridgeEvent, AirbridgeEventSchema } from 'src/schema/airbridge_event';
import { AirbridgeInstall, AirbridgeInstallSchema } from 'src/schema/airbridge_install';
import { AppsflyerEvent, AppsflyerEventSchema } from 'src/schema/appsflyer_event';
import { AppsflyerInstall, AppsflyerInstallSchema } from 'src/schema/appsflyer_install';
import { Daily, DailySchema } from 'src/schema/daily';
import { Event, EventSchema } from 'src/schema/event';
import { MobiconnectEvent, MobiconnectEventSchema } from 'src/schema/mobiconnect_event';
import { MobiconnectInstall, MobiconnectInstallSchema } from 'src/schema/mobiconnect_install';
import { Postback, PostbackSchema } from 'src/schema/postback';
import { SingularEvent, SingularEventSchema } from 'src/schema/singular_event';
import { SingularInstall, SingularInstallSchema } from 'src/schema/singular_install';
import { TradingworksEvent, TradingworksEventSchema } from 'src/schema/tradingworks_event';
import { TradingworksInstall, TradingworksInstallSchema } from 'src/schema/tradingworks_install';
import { AdbrixremasterEventConsumer } from './adbrixremasterEvent.consumer';
import { AdbrixremasterInstallConsumer } from './adbrixremasterInstall.consumer';
import { PostbackConsumer } from './postback.consumer';
import { PostbackController } from './postback.controller';
import { PostbackService } from './postback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostbackRegisteredEvent,
      PostbackDaily,
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
    MongooseModule.forFeature([
      { name: AirbridgeInstall.name, schema: AirbridgeInstallSchema },
      { name: AirbridgeEvent.name, schema: AirbridgeEventSchema },
      { name: TradingworksInstall.name, schema: TradingworksInstallSchema },
      { name: TradingworksEvent.name, schema: TradingworksEventSchema },
      { name: SingularInstall.name, schema: SingularInstallSchema },
      { name: SingularEvent.name, schema: SingularEventSchema },
      { name: AppsflyerInstall.name, schema: AppsflyerInstallSchema },
      { name: AppsflyerEvent.name, schema: AppsflyerEventSchema },
      { name: AdjustInstall.name, schema: AdjustInstallSchema },
      { name: AdjustEvent.name, schema: AdjustEventSchema },
      { name: MobiconnectInstall.name, schema: MobiconnectInstallSchema },
      { name: MobiconnectEvent.name, schema: MobiconnectEventSchema },
      { name: AdbrixremasterInstall.name, schema: AdbrixremasterInstallSchema },
      { name: AdbrixremasterEvent.name, schema: AdbrixremasterEventSchema },
      { name: Daily.name, schema: DailySchema },
      { name: Postback.name, schema: PostbackSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    BullModule.registerQueue({
      name: 'postback',
    }),
    BullModule.registerQueue({
      name: 'adbrixremasterEvent',
    }),
    BullModule.registerQueue({
      name: 'adbrixremasterInstall',
    }),
  ],
  controllers: [PostbackController],
  providers: [PostbackService, PostbackConsumer, AdbrixremasterEventConsumer, AdbrixremasterInstallConsumer],
})
export class PostbackModule {}
