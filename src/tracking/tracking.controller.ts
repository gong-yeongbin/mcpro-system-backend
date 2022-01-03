import { Query, Redirect, Res } from '@nestjs/common';
import { Controller, Get, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { TrackingDto } from './dto/tracking.dto';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  @Redirect()
  async tracking(@Req() request: Request, @Query() query: TrackingDto, @Res() res: Response) {
    const redirectUrl: string = await this.trackingService.tracking(request, query);
    console.log(res);

    console.log(`[ mecrosspro ---> tracker ] redirectUrl:${redirectUrl}`);
    return { url: redirectUrl, statusCode: 302 };
  }
}
