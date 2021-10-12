import { Controller, Get, Query, Request } from '@nestjs/common';
import { AppsflyerService } from './appsflyer.service';
import { AppsflyerInstallDto } from './dto/appsflyer-install.dto';

@Controller('appsflyer')
export class AppsflyerController {
  constructor(private readonly appsflyerService: AppsflyerService) {}

  @Get('/install')
  postbackInstallAppsflyer(@Request() request: any, @Query() query: AppsflyerInstallDto) {
    return this.appsflyerService.postbackInstallAppsflyer(request, query);
  }

  @Get('/event')
  postbackEventAppsflyer(@Request() req: any) {
    return this.appsflyerService.postbackEventAppsflyer(req);
  }
}
