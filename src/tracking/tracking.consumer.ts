import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { Daily, DailyDocument } from 'src/schema/daily';
import * as moment from 'moment-timezone';

@Processor('tracking')
export class TrackingConsumer {
  constructor(@InjectModel(Daily.name) private readonly dailyModel: Model<DailyDocument>) {}

  @Process()
  async trackingHandler(job: Job) {
    const data: any = job.data;
    const token: string = data.token;
    const pub_id: string = data.pub_id;
    const sub_id: string = data.sub_id;
    const view_code: string = data.view_code;
    await this.dailyModel.findOneAndUpdate(
      {
        token: token,
        pub_id: pub_id,
        sub_id: sub_id,
        createdAt: {
          $gte: moment().startOf('day').toISOString(),
          $lte: moment().endOf('day').toISOString(),
        },
      },
      { $set: { impressionCode: view_code } },
      { upsert: true },
    );
  }
}
