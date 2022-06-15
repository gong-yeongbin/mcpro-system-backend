import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import * as moment from 'moment-timezone';
import { Model } from 'mongoose';
import { Daily, DailyDocument } from 'src/schema/daily';

@Processor('tracking')
export class TrackingQueue {
  constructor(@InjectModel(Daily.name) private readonly dailyModel: Model<DailyDocument>) {}

  @Process('click')
  async handleClick(job: Job) {
    const token: string = job.data.token;
    const pub_id: string = job.data.pub_id;
    const sub_id: string = job.data.sub_id;
    const impressionCode: string = job.data.impressionCode;

    await this.dailyModel.findOneAndUpdate(
      {
        token: token,
        pub_id: pub_id,
        sub_id: sub_id,
        impressionCode: impressionCode,
        createdAt: {
          $gte: `${moment().format('YYYY-MM-DD')}T00:00:00.000Z`,
          $lt: `${moment().format('YYYY-MM-DD')}T23:59:59.999Z`,
        },
      },
      { $inc: { click: 1 } },
      { upsert: true },
    );
  }
}
