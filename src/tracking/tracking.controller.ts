import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  @Redirect()
  async tracking(@Req() request: any) {
    const redirectUrl: string = await this.trackingService.tracking(request);

    console.log(`[ mecrosspro ---> tracker ] redirectUrl:${redirectUrl}`);

    return { url: redirectUrl, status: 302 };
  }
}
