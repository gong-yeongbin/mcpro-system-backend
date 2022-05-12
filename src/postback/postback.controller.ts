import { Controller, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { PostbackService } from './postback.service';

@Controller()
export class PostbackController {
  constructor(private readonly postbackService: PostbackService) {}

  @Get('tradingworks/:type')
  async tradingworks(@Param() param: { type: string }, @Req() request: Request) {
    const type: string = param.type;

    if (type === 'install') await this.postbackService.installTradingworks(request);
    else await this.postbackService.eventTradingworks(request);
  }

  @Get('airbridge/:type')
  async airbridge(@Param() param: { type: string }, @Req() request: Request) {
    const type: string = param.type;

    if (type === 'install') await this.postbackService.installAirbridge(request);
    else await this.postbackService.eventAirbridge(request);
  }

  async appsflyer() {}
  async adbrixremaster() {}
  async adjust() {}
  async singular() {}
}
