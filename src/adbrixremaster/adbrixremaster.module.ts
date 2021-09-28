import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdbrixremasterController } from './adbrixremaster.controller';
import { AdbrixremasterService } from './adbrixremaster.service';
import { CommonService } from 'src/common/common.service';
import {
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
      PostbackEventAdbrixremaster,
      PostbackInstallAdbrixremaster,
    ]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [AdbrixremasterController],
  providers: [AdbrixremasterService, CommonService],
})
export class AdbrixremasterModule {}
