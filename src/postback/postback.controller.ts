import { Controller, Get, Query, Req } from '@nestjs/common';
import { PostbackService } from './postback.service';
import { AppsflyerPostbackInstallDto } from './dto/appsflyer-postback-install.dto';
import { AppsflyerPostbackEventDto } from './dto/appsflyer-postback-event.dto';
import { Request } from 'express';

@Controller()
export class PostbackController {
  constructor(private readonly postBackService: PostbackService) {}

  @Get('/appsflyer/install')
  postBackInstallAppsflyer(
    @Req() req: Request,
    @Query() query: AppsflyerPostbackInstallDto,
  ) {
    return this.postBackService.postBackInstallAppsflyer(req, query);
  }

  @Get('/appsflyer/event')
  postBackEventAppsflyer(
    @Req() req: Request,
    @Query() query: AppsflyerPostbackEventDto,
  ) {
    return this.postBackService.postBackEventAppsflyer(req, query);
  }
}
