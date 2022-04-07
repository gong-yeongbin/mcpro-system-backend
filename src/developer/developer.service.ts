import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Config, ConfigDocument } from 'src/schema/Config';

@Injectable()
export class DeveloperService {
  constructor(@InjectModel(Config.name) private configModel: Model<ConfigDocument>) {}

  async getConfig() {
    return await this.configModel.find();
  }

  async createConfig(body: { name: string }) {
    try {
      await this.configModel.create({ name: body.name });
    } catch (error) {
      throw new ConflictException();
    }
  }

  async putConfig(body: { name: string }) {
    await this.configModel.updateOne({ name: body.name }, [{ $set: { status: { $not: '$status' } } }]);
  }
}
