import { Controller, Get, Req } from '@nestjs/common';
import { PostbackService } from './postback.service';

@Controller()
export class PostbackController {
  constructor(private readonly postbackService: PostbackService) {}

  @Get('/appsflyer/install')
  postBackInstallAppsflyer(@Req() req: any) {
    return this.postbackService.postBackInstallAppsflyer(req);
  }

  @Get('/appsflyer/event')
  postBackEventAppsflyer(@Req() req: any) {
    return this.postbackService.postBackEventAppsflyer(req);
  }

  @Get('/adbrix-remaster/install')
  postbackInstall(@Req() req: any) {
    // return this.postbackService.postbackInstall(req);
  }

  @Get('/adbrix-remaster/event')
  postbackEvent(@Req() req: any) {
    // return this.postbackService.postbackEvent(req);
  }
}
