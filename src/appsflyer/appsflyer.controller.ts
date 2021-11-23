import { Controller, Get, Query, Request } from '@nestjs/common';
import { AppsflyerService } from './appsflyer.service';
import { AppsflyerInstallDto } from './dto/appsflyer-install.dto';

@Controller('appsflyer')
export class AppsflyerController {
  constructor(private readonly appsflyerService: AppsflyerService) {}

  @Get('/install')
  postbackInstallAppsflyer(@Request() request: any, @Query() query: AppsflyerInstallDto) {
    this.appsflyerService.postbackInstallAppsflyer(request, query);
  }

  @Get('/event')
  async postbackEventAppsflyer(@Request() req: any): Promise<void> {
    await this.appsflyerService.postbackEventAppsflyer(req);
  }
}
