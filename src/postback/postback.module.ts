import { PostbackEventAirbridge, PostbackEventTradingworks, PostbackInstallAirbridge, PostbackInstallTradingworks } from '@entities/Entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostbackController } from './postback.controller';
import { PostbackService } from './postback.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostbackEventAirbridge, PostbackEventTradingworks, PostbackInstallAirbridge, PostbackInstallTradingworks])],
  controllers: [PostbackController],
  providers: [PostbackService],
})
export class PostbackModule {}
