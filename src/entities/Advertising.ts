import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Advertiser } from './Advertiser';
import { Campaign } from './Campaign';
import { Tracker } from './Tracker';

@Entity('advertising')
@Unique(['ad_code'])
export class Advertising {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'ad_code' })
  ad_code: string;

  @Column({ type: 'nvarchar', name: 'ad_name' })
  ad_name: string;

  @Column({ type: 'nvarchar', name: 'platform' })
  platform: string;

  @Column({
    type: 'nvarchar',
    name: 'image_url',
    nullable: true,
  })
  image_url: string;

  @Column({
    type: 'boolean',
    name: 'status',
    default: true,
  })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Advertiser, (advertiser) => advertiser.advertising)
  @JoinColumn({ name: 'advertiser' })
  advertiser: Advertiser;

  @ManyToOne(() => Tracker, (tracker) => tracker.advertising)
  @JoinColumn({ name: 'tracker' })
  tracker: Tracker;

  @OneToMany(() => Campaign, (campaign) => campaign.advertising)
  campaign: Campaign[];
}
