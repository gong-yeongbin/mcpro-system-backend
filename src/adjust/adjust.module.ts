import PostbackEventAdjust from '@entities/PostbackEventAdjust';
import PostbackInstallAdjust from '@entities/PostbackInstallAdjust';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdjustController } from './adjust.controller';
import { AdjustService } from './adjust.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostbackInstallAdjust, PostbackEventAdjust])],
  controllers: [AdjustController],
  providers: [AdjustService],
})
export class AdjustModule {}
