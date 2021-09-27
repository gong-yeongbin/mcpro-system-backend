import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { AdbrixremasterService } from './adbrixremaster/adbrixremaster.service';
import { AppsflyerService } from './appsflyer/appsflyer.service';

@Controller()
export class PostbackController {
  constructor(private readonly appsfyerService: AppsflyerService, private readonly adbrixremasterService: AdbrixremasterService) {}

  @Get('/appsflyer/install')
  postbackInstallAppsflyer(@Req() req: any) {
    return this.appsfyerService.postbackInstallAppsflyer(req);
  }

  @Get('/appsflyer/event')
  postbackEventAppsflyer(@Req() req: any) {
    return this.appsfyerService.postbackEventAppsflyer(req);
  }

  @Get('/adbrix-remaster/install')
  postbackInstall(@Req() req: any) {
    return this.adbrixremasterService.postbackInstallAdbrixRemaster(req);
  }

  @Get('/adbrix-remaster/event')
  postbackEvent(@Req() req: any) {
    return this.adbrixremasterService.postbackEventAdbrixRemaster(req);
  }
}
