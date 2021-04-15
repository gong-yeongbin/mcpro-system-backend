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

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'groupCode' })
  groupCode: string;

  @Column({ type: 'nvarchar', name: 'oldCampaignName' })
  oldCampaignName: string;

  @Column({ type: 'nvarchar', name: 'newCampaignName' })
  newCampaignName: string;

  @Column({ type: 'nvarchar', name: 'oldTrackerTrackingUrl' })
  oldTrackerTrackingUrl: string;

  @Column({ type: 'nvarchar', name: 'newTrackerTrackingUrl' })
  newTrackerTrackingUrl: string;

  @Column({ name: 'reservedAt' })
  reservedAt: Date;

  @Column({ type: 'boolean', name: 'status' })
  status: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.reservation, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.reservations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;
}
