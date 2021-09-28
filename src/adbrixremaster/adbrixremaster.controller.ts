import { Controller, Get, Req } from '@nestjs/common';
import { AdbrixremasterService } from './adbrixremaster.service';

@Controller('adbrix-remaster')
export class AdbrixremasterController {
  constructor(private readonly adbrixremasterService: AdbrixremasterService) {}

  @Get('/install')
  postbackInstall(@Req() req: any) {
    return this.adbrixremasterService.postbackInstallAdbrixRemaster(req);
  }

  @Get('/event')
  postbackEvent(@Req() req: any) {
    return this.adbrixremasterService.postbackEventAdbrixRemaster(req);
  }
}
