import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Advertising } from './Advertising';
import { Campaign } from './Campaign';

@Entity('mcp_reservation')
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'oldCampaignName' })
  oldCampaignName: string;

  @Column({ type: 'nvarchar', name: 'newCampaignName' })
  newCampaignName: string;

  @Column({ type: 'nvarchar', name: 'oldTrackerTrackingUrl' })
  oldTrackerTrackingUrl: string;

  @Column({ type: 'nvarchar', name: 'newTrackerTrackingUrl' })
  newTrackerTrackingUrl: string;

  @Column({ type: 'boolean', name: 'status', default: false })
  status: boolean;

  @Column({ name: 'reserved_at' })
  reserved_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.reservation, {
    onDelete: 'CASCADE',
  })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.reservation, {
    onDelete: 'CASCADE',
  })
  campaign: Campaign;
}
