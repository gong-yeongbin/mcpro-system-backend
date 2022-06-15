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

    const daily: Daily = await this.dailyModel.findOne({
      token: token,
      pub_id: pub_id,
      sub_id: sub_id,
      impressionCode: impressionCode,
      createdAt: {
        $gte: moment(moment().startOf('day')).toDate(),
        $lte: moment(moment().endOf('day')).toDate(),
      },
    });

    if (!daily) {
      await this.dailyModel.create({ token: token, pub_id: pub_id, sub_id: sub_id, impressionCode: impressionCode });
    }
    await this.dailyModel.updateOne({ token: token, pub_id: pub_id, sub_id: sub_id, impressionCode: impressionCode }, { $inc: { click: 1 } });

    // await this.dailyModel.findOneAndUpdate(
    //   {
    //     token: token,
    //     pub_id: pub_id,
    //     sub_id: sub_id,
    //     impressionCode: impressionCode,
    //   },
    //   {
    //     $inc: { click: 1 },
    //   },
    //   { upsert: true },
    // );
  }
}
