import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import * as moment from 'moment-timezone';
import { Daily, DailyDocument } from 'src/schema/daily';

@Processor('daily')
export class DailyConsumer {
  constructor(@InjectModel(Daily.name) private readonly dailyModel: Model<DailyDocument>) {}

  @Process()
  async eventHandler(job: Job) {
    const data: { token: string; pub_id: string; sub_id: string; impressionCode: string } = job.data;
    const token: string = data.token;
    const pub_id: string = data.pub_id;
    const sub_id: string = data.sub_id;
    const impressionCode: string = data.impressionCode;

    this.dailyModel
      .findOne({
        impressionCode: impressionCode,
        createdAt: {
          $gte: moment().startOf('day').toISOString(),
          $lte: moment().endOf('day').toISOString(),
        },
      })
      .then(async (daily) => {
        if (!daily) {
          await this.dailyModel.create({
            impressionCode: impressionCode,
            token: token,
            pub_id: pub_id,
            sub_id: sub_id,
          });
        }
      });
  }
}
