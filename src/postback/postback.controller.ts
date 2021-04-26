import { Controller, Get, Query, Res } from '@nestjs/common';
import { PostbackInstallDto } from './dto/postback-install.dto';
import { PostbackService } from './postback.service';

@Controller()
export class PostbackController {
  constructor(private readonly postBackService: PostbackService) {}

  @Get('/postback-install')
  postBackInstall(@Query() req: PostbackInstallDto, @Res() res: any) {
    return this.postBackService.postBackInstall(req, res);
  }
}
