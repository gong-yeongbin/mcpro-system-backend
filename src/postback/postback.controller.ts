import { Controller, Get, Query, Req } from '@nestjs/common';
import { PostbackEventDto } from './dto/postback-event.dto';
import { PostbackInstallDto } from './dto/postback-install.dto';
import { PostbackService } from './postback.service';

@Controller()
export class PostbackController {
  constructor(private readonly postBackService: PostbackService) {}

  @Get('/postback-install')
  postBackInstall(@Req() req: any, @Query() query: PostbackInstallDto) {
    return this.postBackService.postBackInstall(req, query);
  }

  @Get('/postback-event')
  postBackEvent(@Req() req: any, @Query() query: PostbackEventDto) {
    return this.postBackService.postBackEvent(req, query);
  }
}
