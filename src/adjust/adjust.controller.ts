import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AdjustService } from './adjust.service';

@Controller('adjust')
export class AdjustController {
  constructor(private readonly adjustService: AdjustService) {}

  @Get('/install')
  postbackInstall(@Req() request: Request): void {
    this.adjustService.postbackInstall(request);
  }

  @Get('/event')
  postbackEvent(@Req() request: Request): void {
    this.adjustService.postbackEvent(request);
  }
}
