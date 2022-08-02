import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { ImpressionCode, ImpressionCodeDocument } from 'src/schema/impressionCode';

@Processor('impressionCode')
export class ImpressionCodeConsumer {
  constructor(@InjectModel(ImpressionCode.name) private readonly impressionCodeModel: Model<ImpressionCodeDocument>) {}

  @Process()
  async eventHandler(job: Job) {
    const data: { token: string; pub_id: string; sub_id: string; impressionCode: string } = job.data;

    const token: string = data.token;
    const pub_id: string = data.pub_id;
    const sub_id: string = data.sub_id;
    const impressionCode: string = data.impressionCode;

    const impressionCodeInstance: ImpressionCode = await this.impressionCodeModel.findOne({ token: token, pub_id: pub_id, sub_id: sub_id }).exec();

    if (!impressionCodeInstance) await this.impressionCodeModel.create({ token: token, pub_id: pub_id, sub_id: sub_id, impressionCode: impressionCode });
  }
}
