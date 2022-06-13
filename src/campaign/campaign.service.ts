import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign, CampaignDocument } from 'src/schema/campaign';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign as Campaign1 } from '@entities/Entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectRepository(Campaign1)
    private readonly campaignRepository: Repository<Campaign1>,
  ) {}

  async getCampaign(token: string): Promise<Campaign1> {
    // const campaignInstance: Campaign await this.campaignModel.findOne({ token: token, status: true });
    const campaignEntity: Campaign1 = await this.campaignRepository.findOne({
      where: {
        token: token,
        status: true,
      },
    });

    // if (!campaignInstance) throw new NotFoundException();
    if (!campaignEntity) throw new NotFoundException();

    return campaignEntity;
  }
}
