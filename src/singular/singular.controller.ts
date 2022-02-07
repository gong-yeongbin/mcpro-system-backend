import { Controller, Get, Request } from '@nestjs/common';
import { SingularService } from './singular.service';

@Controller('singular')
export class SingularController {
  constructor(private readonly sigularServiece: SingularService) {}

  @Get('/install')
  async postbackInstallAppsflyer(@Request() request: any): Promise<void> {
    await this.sigularServiece.postbackInstallSingular(request);
  }

  @Get('/event')
  async postbackEventAppsflyer(@Request() req: any): Promise<void> {
    await this.sigularServiece.postbackEventSingular(req);
  }
}
