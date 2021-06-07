import { Controller, Get, Query, Req } from '@nestjs/common';
import { PostbackService } from './postback.service';
import { AppsflyerPostbackInstallDto } from './dto/appsflyer-postback-install.dto';
import { AppsflyerPostbackEventDto } from './dto/appsflyer-postback-event.dto';

@Controller()
export class PostbackController {
  constructor(private readonly postBackService: PostbackService) {}

  // @Get('/adbrix-remaster/install')
  // postBackInstallAdbrixRemaster(
  //   @Req() req: any,
  //   @Query() query: AdbrixRemasterPostbackInstallDto,
  // ) {
  //   return this.postBackService.postBackInstallAdbrixRemaster(req, query);
  // }

  // @Get('/adbrix-remaster/event')
  // postBackEventAdbrixRemaster(
  //   @Req() req: any,
  //   @Query() query: AdbrixRemasterPostbackEventDto,
  // ) {
  //   return this.postBackService.postBackEventAdbrixRemaster(req, query);
  // }

  @Get('/appsflyer/install')
  postBackInstallAppsflyer(
    @Req() req: any,
    @Query() query: AppsflyerPostbackInstallDto,
  ) {
    return this.postBackService.postBackInstallAppsflyer(req, query);
  }

  @Get('/appsflyer/event')
  postBackEventAppsflyer(
    @Req() req: any,
    @Query() query: AppsflyerPostbackEventDto,
  ) {
    return this.postBackService.postBackEventAppsflyer(req, query);
  }
}
