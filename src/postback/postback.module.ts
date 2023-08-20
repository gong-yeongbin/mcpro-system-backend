import {
  Postback,
  PostbackDaily,
  PostbackEventAdbrixremaster,
  PostbackEventAdjust,
  PostbackEventAirbridge,
  PostbackEventAppsflyer,
  PostbackEventDecotra,
  PostbackEventIve,
  PostbackEventMobiconnect,
  PostbackEventSingular,
  PostbackEventTradingworks,
  PostbackInstallAdbrixremaster,
  PostbackInstallAdjust,
  PostbackInstallAirbridge,
  PostbackInstallAppsflyer,
  PostbackInstallDecotra,
  PostbackInstallIve,
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
import { Campaign, CampaignSchema } from 'src/schema/campaign';
import { Daily, DailySchema } from 'src/schema/daily';
import { DecotraEvent, DecotraEventSchema } from 'src/schema/decotra_event';
import { DecotraInstall, DecotraInstallSchema } from 'src/schema/decotra_install';
import { Event, EventSchema } from 'src/schema/event';
import { ImpressionCode, ImpressionCodeSchema } from 'src/schema/impressionCode';
import { IveEvent, IveEventSchema } from 'src/schema/ive_event';
import { IveInstall, IveInstallSchema } from 'src/schema/ive_install';
import { MobiconnectEvent, MobiconnectEventSchema } from 'src/schema/mobiconnect_event';
import { MobiconnectInstall, MobiconnectInstallSchema } from 'src/schema/mobiconnect_install';
import { SingularEvent, SingularEventSchema } from 'src/schema/singular_event';
import { SingularInstall, SingularInstallSchema } from 'src/schema/singular_install';
import { TradingworksEvent, TradingworksEventSchema } from 'src/schema/tradingworks_event';
import { TradingworksInstall, TradingworksInstallSchema } from 'src/schema/tradingworks_install';
import { AdbrixremasterEventConsumer } from './adbrixremasterEvent.consumer';
import { AdbrixremasterInstallConsumer } from './adbrixremasterInstall.consumer';
import { PostbackConsumer } from './postback.consumer';
import { PostbackController } from './postback.controller';
import { PostbackService } from './postback.service';
import { NswitchInstall, NswitchInstallSchema } from 'src/schema/nswitch_install';
import { NswitchEvent, NswitchEventSchema } from 'src/schema/nswitch_event';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Postback,
      PostbackRegisteredEvent,
      PostbackDaily,
      PostbackInstallAirbridge,
      PostbackInstallTradingworks,
      PostbackInstallAppsflyer,
      PostbackInstallAdbrixremaster,
      PostbackInstallAdjust,
      PostbackInstallSingular,
      PostbackInstallMobiconnect,
      PostbackInstallIve,
      PostbackInstallDecotra,
      PostbackEventAirbridge,
      PostbackEventTradingworks,
      PostbackEventAppsflyer,
      PostbackEventAdbrixremaster,
      PostbackEventAdjust,
      PostbackEventSingular,
      PostbackEventMobiconnect,
      PostbackEventIve,
      PostbackEventDecotra,
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
      { name: IveInstall.name, schema: IveInstallSchema },
      { name: IveEvent.name, schema: IveEventSchema },
      { name: DecotraInstall.name, schema: DecotraInstallSchema },
      { name: DecotraEvent.name, schema: DecotraEventSchema },
      { name: NswitchInstall.name, schema: NswitchInstallSchema },
      { name: NswitchEvent.name, schema: NswitchEventSchema },
      { name: Daily.name, schema: DailySchema },
      { name: Event.name, schema: EventSchema },
      { name: ImpressionCode.name, schema: ImpressionCodeSchema },
      { name: Campaign.name, schema: CampaignSchema },
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
