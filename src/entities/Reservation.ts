import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Campaign } from './Entity';

@Entity('reservation')
export default class Reservation {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'oldCampaignName' })
  oldCampaignName: string;

  @Column({ type: 'nvarchar', name: 'newCampaignName' })
  newCampaignName: string;

  @Column({ type: 'text', name: 'oldTrackerTrackingUrl' })
  oldTrackerTrackingUrl: string;

  @Column({ type: 'text', name: 'newTrackerTrackingUrl' })
  newTrackerTrackingUrl: string;

  @Column({ type: 'boolean', name: 'status', default: false })
  status: boolean;

  @CreateDateColumn({ name: 'reserved_at' })
  reserved_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.reservation)
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;
}
