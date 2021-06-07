import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';
import { TrackingDto } from './dto/tracking.dto';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  @Redirect()
  async tracking(@Query() requestQuery: TrackingDto) {
    const redirectUrl: string = await this.trackingService.tracking(
      requestQuery,
    );
    console.log(`[ mecrosspro ---> tracker ] redirectUrl:${redirectUrl}`);
    return { url: redirectUrl, status: 302 };
  }
}
