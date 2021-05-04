import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { CampaignDaily } from 'src/entities/CampaignDaily';
import { SubMedia } from 'src/entities/SubMedia';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, SubMedia])],
  controllers: [TrackingController],
  providers: [TrackingService],
})
export class TrackingModule {}
