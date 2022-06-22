import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { Daily, DailyDocument } from 'src/schema/daily';
import { Postback, PostbackDocument } from 'src/schema/postback';
import * as moment from 'moment-timezone';
import { Event, EventDocument } from 'src/schema/event';

@Processor('postback')
export class PostbackConsumer {
  constructor(
    @InjectModel(Daily.name) private readonly dailyModel: Model<DailyDocument>,
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(Postback.name) private readonly postbackModel: Model<PostbackDocument>,
  ) {}

  @Process()
  async postbackHandler(job: Job) {
    const data: Postback = job.data;
    const token: string = data.token;
    const impressionCode: string = data.impressionCode;
    const event_name: string = data.event_name;
    const revenue: number = data.revenue;

    const event: Event = await this.eventModel.findOne({
      token: token,
      tracker: event_name,
    });

    let inc = {};

    if (!event) inc = { unregistered: 1 };
    else if (event.admin == 'install') inc = { install: 1 };
    else if (event.admin == 'registration') inc = { registration: 1 };
    else if (event.admin == 'retention') inc = { retention: 1 };
    else if (event.admin == 'etc1') inc = { etc1: 1 };
    else if (event.admin == 'etc2') inc = { etc2: 1 };
    else if (event.admin == 'etc3') inc = { etc3: 1 };
    else if (event.admin == 'etc4') inc = { etc4: 1 };
    else if (event.admin == 'etc5') inc = { etc5: 1 };
    else if (event.admin == 'purchase') inc = { purchase: 1, revenue: revenue };

    const daily: Daily = await this.dailyModel.findOneAndUpdate(
      {
        impressionCode: impressionCode,
        token: token,
        createdAt: {
          $gte: moment().startOf('day').toISOString(),
          $lte: moment().endOf('day').toISOString(),
        },
      },
      { $inc: inc },
      { upsert: true, new: true },
    );

    data.daily = daily;
    await this.postbackModel.create(data);
  }
}
