import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { Daily, DailyDocument } from 'src/schema/daily';
import { Postback, PostbackDocument } from 'src/schema/postback';
import * as moment from 'moment-timezone';
import { Event, EventDocument } from 'src/schema/event';
import { ImpressionCode, ImpressionCodeDocument } from 'src/schema/impressionCode';

@Processor('postback')
export class PostbackConsumer {
  constructor(
    @InjectModel(Daily.name) private readonly dailyModel: Model<DailyDocument>,
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(Postback.name) private readonly postbackModel: Model<PostbackDocument>,
    @InjectModel(ImpressionCode.name) private readonly impressionCodeModel: Model<ImpressionCodeDocument>,
  ) {}

  @Process()
  async postbackHandler(job: Job) {
    const data: Postback = job.data;
    const token: string = data.token;
    const impressionCode: string = data.impressionCode;
    const event_name: string = data.event_name;
    const revenue: number = data.revenue;

    const impressionCodeInstance: ImpressionCode = await this.impressionCodeModel.findOne({ impressionCode: impressionCode });

    const eventInstance: Event = await this.eventModel.findOne({
      token: token,
      tracker: event_name,
    });

    let inc = {};

    if (!eventInstance) inc = { unregistered: 1 };
    else if (eventInstance.admin == 'install') inc = { install: 1 };
    else if (eventInstance.admin == 'registration') inc = { registration: 1 };
    else if (eventInstance.admin == 'retention') inc = { retention: 1 };
    else if (eventInstance.admin == 'etc1') inc = { etc1: 1 };
    else if (eventInstance.admin == 'etc2') inc = { etc2: 1 };
    else if (eventInstance.admin == 'etc3') inc = { etc3: 1 };
    else if (eventInstance.admin == 'etc4') inc = { etc4: 1 };
    else if (eventInstance.admin == 'etc5') inc = { etc5: 1 };
    else if (eventInstance.admin == 'purchase') inc = { purchase: 1, revenue: revenue };

    this.dailyModel.findOne(
      {
        impressionCode: impressionCode,
        createdAt: {
          $gte: moment().startOf('day').toISOString(),
          $lte: moment().endOf('day').toISOString(),
        },
      },
      async (err, daily) => {
        if (!daily) {
          await this.dailyModel.create({
            impressionCode: impressionCode,
            token: token,
            pub_id: impressionCodeInstance.pub_id,
            sub_id: impressionCodeInstance.sub_id,
          });
        }

        data.daily = await this.dailyModel.findOneAndUpdate(
          {
            impressionCode: impressionCode,
            createdAt: {
              $gte: moment().startOf('day').toISOString(),
              $lte: moment().endOf('day').toISOString(),
            },
          },
          { $inc: inc },
        );

        await this.postbackModel.create(data);
      },
    );
  }
}
