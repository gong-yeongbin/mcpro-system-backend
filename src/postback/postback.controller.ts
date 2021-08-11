import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { AdbrixremasterService } from './adbrixremaster/adbrixremaster.service';
import { AppsflyerService } from './appsflyer/appsflyer.service';

@Controller()
export class PostbackController {
  constructor(private readonly appsfyerService: AppsflyerService, private readonly adbrixremasterService: AdbrixremasterService) {}

  @Get('/appsflyer/install')
  postBackInstallAppsflyer(@Req() req: any) {
    return this.appsfyerService.postBackInstallAppsflyer(req);
  }

  @Get('/appsflyer/event')
  postBackEventAppsflyer(@Req() req: any) {
    return this.appsfyerService.postBackEventAppsflyer(req);
  }

  @Get('/adbrix-remaster/install')
  postbackInstall(@Req() req: any) {
    return this.adbrixremasterService.postBackInstallAdbrixRemaster(req);
  }

  @Get('/adbrix-remaster/event')
  postbackEvent(@Req() req: any) {
    return this.adbrixremasterService.postBackEventAdbrixRemaster(req);
  }
}
