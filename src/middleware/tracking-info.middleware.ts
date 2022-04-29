import { Model } from 'mongoose';
import { ConsoleLogger, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request } from 'express';
import { Config, ConfigDocument } from 'src/schema/Config';
import { TrackingInfo, TrackingInfoDocument } from 'src/schema/TrackingInfo';

@Injectable()
export class TrackingInfoMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Config.name) private configModel: Model<ConfigDocument>,
    @InjectModel(TrackingInfo.name) private trackingInfoModel: Model<TrackingInfoDocument>,
  ) {}

  async use(req: any, res: any, next: NextFunction) {
    const configInstance: Config = await this.configModel.findOne({ name: 'trackingInfo' });

    const token: string = req.query.token;
    const click_id: string = req.query.click_id;
    const pubId: string = req.query.pub_id;
    const subId: string = req.query.sub_id;
    const adid: string = req.query.adid;
    const idfa: string = req.query.idfa;

    if (configInstance.status) {
      await this.trackingInfoModel.create({ token: token, clickId: click_id, pubId: pubId, subId: subId, adid: adid, idfa: idfa });
    }

    next();
  }
}
