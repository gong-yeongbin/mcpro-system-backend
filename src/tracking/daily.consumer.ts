import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import * as moment from 'moment-timezone';
import { Daily, DailyDocument } from 'src/schema/daily';
import { ImpressionCode, ImpressionCodeDocument } from 'src/schema/impressionCode';

@Processor('daily')
export class DailyConsumer {
  constructor(
    @InjectModel(Daily.name) private readonly dailyModel: Model<DailyDocument>,
    @InjectModel(ImpressionCode.name) private readonly impressionCodeModel: Model<ImpressionCodeDocument>,
  ) {}

  @Process()
  async eventHandler(job: Job) {
    const data: { token: string; pub_id: string; sub_id: string } = job.data;
    const token: string = data.token;
    const pub_id: string = data.pub_id;
    const sub_id: string = data.sub_id;

    const dailyInstance: Daily = await this.dailyModel.findOne({
      token: token,
      pub_id: pub_id,
      sub_id: sub_id,
      createdAt: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() },
    });

    if (!dailyInstance) {
      const impressionCodeInstance: ImpressionCode = await this.impressionCodeModel.findOne({ token: token, pub_id: pub_id, sub_id: sub_id });
      await this.dailyModel.create({ token: token, pub_id: pub_id, sub_id: sub_id, impressionCode: impressionCodeInstance.impressionCode });
    }
  }
}
