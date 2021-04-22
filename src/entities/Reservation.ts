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

  @Column({ type: 'nvarchar', name: 'reserve_code', length: 45 })
  reserveCode: string;

  @Column({ type: 'nvarchar', name: 'oldCampaignName', length: 45 })
  oldCampaignName: string;

  @Column({ type: 'nvarchar', name: 'newCampaignName', length: 45 })
  newCampaignName: string;

  @Column({ type: 'nvarchar', name: 'oldTrackerTrackingUrl', length: 200 })
  oldTrackerTrackingUrl: string;

  @Column({ type: 'nvarchar', name: 'newTrackerTrackingUrl', length: 200 })
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
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.reservation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;
}
