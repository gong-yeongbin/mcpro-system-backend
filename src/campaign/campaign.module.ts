import { Campaign as Campaign1 } from '@entities/Entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign, CampaignSchema } from 'src/schema/campaign';
import { CampaignService } from './campaign.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign1]), MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }])],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
