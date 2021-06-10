import { Controller, Get, Req } from '@nestjs/common';
import { PostbackService } from './postback.service';

@Controller()
export class PostbackController {
  constructor(private readonly postBackService: PostbackService) {}

  @Get('/appsflyer/install')
  postBackInstallAppsflyer(@Req() req: any) {
    return this.postBackService.postBackInstallAppsflyer(req);
  }

  @Get('/appsflyer/event')
  postBackEventAppsflyer(@Req() req: any) {
    return this.postBackService.postBackEventAppsflyer(req);
  }
}
