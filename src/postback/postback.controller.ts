import { Controller, Get, Query, Req } from '@nestjs/common';
import { PostbackInstallDto } from './dto/postback-install.dto';
import { PostbackService } from './postback.service';

@Controller()
export class PostbackController {
  constructor(private readonly postBackService: PostbackService) {}

  @Get('/postback-install')
  postBackInstall(@Req() req: any, @Query() query: PostbackInstallDto) {
    return this.postBackService.postBackInstall(req, query);
  }
}
