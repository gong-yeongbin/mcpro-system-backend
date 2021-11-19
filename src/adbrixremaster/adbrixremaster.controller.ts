import { Request } from 'express';
import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { AdbrixremasterService } from './adbrixremaster.service';

@Controller('adbrix-remaster')
export class AdbrixremasterController {
  constructor(private readonly adbrixremasterService: AdbrixremasterService) {}

  @Get('/install')
  postbackInstall(@Req() request: Request) {
    this.adbrixremasterService.postbackInstallAdbrixRemaster(request);
  }

  @Get('/event')
  postbackEvent(@Req() request: Request) {
    this.adbrixremasterService.postbackEventAdbrixRemaster(request);
  }
}
