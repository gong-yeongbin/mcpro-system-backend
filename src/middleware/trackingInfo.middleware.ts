import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, NextFunction } from 'express';
import { Model } from 'mongoose';
import { Config, ConfigDocument } from 'src/schema/config';
import { TrackingInfo, TrackingInfoDocument } from 'src/schema/tracking-info';

@Injectable()
export class TrackingInfoMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
    @InjectModel(TrackingInfo.name) private trackingInfoModel: Model<TrackingInfoDocument>,
  ) {}

  async use(request: any, response: any, next: NextFunction): Promise<void> {
    const query: TrackingInfo = request.query;
    let config: Config = await this.configModel.findOne({ name: 'trackingInfo' });

    if (!config) config = await this.configModel.create({ name: 'trackingInfo' });

    if (config.status) await this.trackingInfoModel.create({ ...query });

    next();
  }
}
