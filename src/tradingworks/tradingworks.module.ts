import { Module } from '@nestjs/common';
import { TradingworksController } from './tradingworks.controller';
import { TradingworksService } from './tradingworks.service';

@Module({
  controllers: [TradingworksController],
  providers: [TradingworksService],
})
export class TradingworksModule {}
