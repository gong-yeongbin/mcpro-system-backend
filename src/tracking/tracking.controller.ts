import { Controller, Get, Query, Redirect, Logger } from '@nestjs/common';
import { TrackingDto } from './dto/tracking.dto';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly trackingService: TrackingService,
    private readonly logger = new Logger(TrackingController.name),
  ) {}

  @Get()
  @Redirect()
  async tracking(@Query() requestQuery: TrackingDto) {
    const redirectUrl: string = await this.trackingService.tracking(
      requestQuery,
    );
    this.logger.log(`\n [mecrosspro -> tracker] : ${redirectUrl}`);
    return { url: redirectUrl, status: 302 };
  }
}
