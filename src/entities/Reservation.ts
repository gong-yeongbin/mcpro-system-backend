import {
  Column,
  Entity,
  JoinColumn,
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

  @Column({ type: 'nvarchar', name: 'reserve_code' })
  reserveCode: string;

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
  reservedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.reservation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.reservation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;
}
