import { Query, Redirect } from '@nestjs/common';
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { TrackingDto } from './dto/tracking.dto';
import { TrackingService } from './tracking.service';

import * as moment from 'moment-timezone';
import { InjectModel } from '@nestjs/mongoose';
import { TrackingLog, TrackingLogDocument } from 'src/schema/tracking_log';
import { Model } from 'mongoose';

interface ITrackingLog {
  token: string;
  adid: string;
  idfa: string;
}

@Controller('tracking')
export class TrackingController {
  private collectedData: ITrackingLog[] = [];

  constructor(private readonly trackingService: TrackingService, @InjectModel(TrackingLog.name) private TrackingLogModel: Model<TrackingLogDocument>) {}

  @Get()
  @Redirect()
  async tracking(@Req() request: Request, @Query() query: TrackingDto) {
    this.collectedData.push({
      token: query.token,
      adid: query.adid,
      idfa: query.idfa,
    });

    const redirectUrl: string = await this.trackingService.tracking(request, query);

    console.log(`[ mecrosspro ---> tracker ] redirectUrl:${redirectUrl}`);
    return { url: redirectUrl, statusCode: 302 };
  }

  private async saveData() {
    const data_length: number = this.collectedData.length;
    const save_data: ITrackingLog[] = this.collectedData.splice(0, data_length);

    try {
      await this.TrackingLogModel.insertMany(save_data);
    } catch (error) {
      console.log(error);
    }
  }

  onModuleInit() {
    setInterval(() => {
      this.saveData();
    }, 30000);
  }
}
