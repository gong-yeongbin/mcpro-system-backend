import { Redirect } from '@nestjs/common';
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  @Redirect()
  async tracking(@Req() request: Request) {
    const redirectUrl: string = await this.trackingService.tracking(request);

    console.log(`[ mecrosspro ---> tracker ] redirectUrl:${redirectUrl}`);
    return { url: redirectUrl, statusCode: 302 };
  }
}
