import { Res } from '@nestjs/common';
import { Controller, Get, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  async tracking(@Req() request: Request, @Res() response: Response) {
    const redirectUrl: string = await this.trackingService.tracking(request);

    console.log(`[ mecrosspro ---> tracker ] redirectUrl:${redirectUrl}`);
    response.status(302).redirect(redirectUrl);
  }
}
