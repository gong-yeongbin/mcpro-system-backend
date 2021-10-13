import { Request, Response } from 'express';
import { Controller, Get, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { AdbrixremasterService } from './adbrixremaster.service';

@Controller('adbrix-remaster')
export class AdbrixremasterController {
  constructor(private readonly adbrixremasterService: AdbrixremasterService) {}

  @Get('/install')
  @HttpCode(200)
  async postbackInstall(@Req() request: Request) {
    return await this.adbrixremasterService.postbackInstallAdbrixRemaster(request);
  }

  @Get('/event')
  @HttpCode(200)
  async postbackEvent(@Req() request: Request) {
    return await this.adbrixremasterService.postbackEventAdbrixRemaster(request);
  }
}
