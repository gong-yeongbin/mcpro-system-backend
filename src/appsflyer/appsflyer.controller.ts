import { Controller, Get, Req } from '@nestjs/common';
import { AppsflyerService } from './appsflyer.service';

@Controller('appsflyer')
export class AppsflyerController {
  constructor(private readonly appsflyerService: AppsflyerService) {}

  @Get('/install')
  postbackInstallAppsflyer(@Req() req: any) {
    return this.appsflyerService.postbackInstallAppsflyer(req);
  }

  @Get('/event')
  postbackEventAppsflyer(@Req() req: any) {
    return this.appsflyerService.postbackEventAppsflyer(req);
  }
}
