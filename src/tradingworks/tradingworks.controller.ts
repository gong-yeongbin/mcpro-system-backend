import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { TradingworksService } from './tradingworks.service';

@Controller('tradingworks')
export class TradingworksController {
  constructor(private readonly tradingworksService: TradingworksService) {}

  @Get('/install')
  async postbackInstall(@Req() request: any): Promise<void> {
    await this.tradingworksService.install(request);
  }

  @Get('/event')
  async postbackEvent(@Req() request: Request): Promise<void> {
    await this.tradingworksService.event(request);
  }
}
