import { Controller, Get, Request } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get()
  tracking(@Request() req: any) {
    return this.trackingService.tracking(req);
  }
}
