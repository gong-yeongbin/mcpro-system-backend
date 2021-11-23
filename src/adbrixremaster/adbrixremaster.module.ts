import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdbrixremasterController } from './adbrixremaster.controller';
import { AdbrixremasterService } from './adbrixremaster.service';
import { Campaign, PostbackInstallAdbrixremaster, PostbackEventAdbrixremaster, PostbackRegisteredEvent, PostbackDaily } from '../entities/Entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, PostbackDaily, PostbackRegisteredEvent, PostbackEventAdbrixremaster, PostbackInstallAdbrixremaster])],
  controllers: [AdbrixremasterController],
  providers: [AdbrixremasterService],
})
export class AdbrixremasterModule {}
