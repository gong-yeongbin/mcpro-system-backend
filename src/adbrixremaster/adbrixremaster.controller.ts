import { Request } from 'express';
import { Controller, Get, Req } from '@nestjs/common';
import { AdbrixremasterService } from './adbrixremaster.service';

@Controller('adbrix-remaster')
export class AdbrixremasterController {
  constructor(private readonly adbrixremasterService: AdbrixremasterService) {}

  @Get('/install')
  async postbackInstall(@Req() request: Request): Promise<void> {
    await this.adbrixremasterService.postbackInstallAdbrixRemaster(request);
  }

  @Get('/event')
  async postbackEvent(@Req() request: Request): Promise<void> {
    await this.adbrixremasterService.postbackEventAdbrixRemaster(request);
  }
}
