import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AdjustService } from './adjust.service';

@Controller('adjust')
export class AdjustController {
  constructor(private readonly adjustService: AdjustService) {}

  @Get('/install')
  async postbackInstall(@Req() request: Request): Promise<void> {
    await this.adjustService.postbackInstall(request);
  }

  @Get('/event')
  async postbackEvent(@Req() request: Request): Promise<void> {
    await this.adjustService.postbackEvent(request);
  }
}
