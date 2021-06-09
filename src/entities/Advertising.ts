import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Advertiser } from './Advertiser';
import { Tracker } from './Tracker';
import { Campaign } from './Campaign';
import { Reservation } from './Reservation';
import { SubMedia } from '../entities/SubMedia';

@Entity('mcp_advertising')
@Unique(['ad_code'])
export class Advertising {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'ad_code' })
  ad_code: string;

  @Column({ type: 'nvarchar', name: 'ad_name' })
  ad_name: string;

  @Column({ type: 'nvarchar', name: 'ad_platform' })
  ad_platform: string;

  @Column({
    type: 'nvarchar',
    name: 'ad_image_url',
    nullable: true,
  })
  ad_image_url: string;

  @Column({
    type: 'boolean',
    name: 'ad_status',
    default: true,
  })
  ad_status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.advertising)
  campaign: Campaign[];

  @OneToMany(() => Reservation, (reservation) => reservation.advertising)
  reservation: Reservation[];

  @ManyToOne(() => Advertiser, (advertiser) => advertiser.advertising, {
    onDelete: 'CASCADE',
  })
  advertiser: Advertiser;

  @ManyToOne(() => Tracker, (tracker) => tracker.advertising, {
    onDelete: 'CASCADE',
  })
  tracker: Tracker;

  @OneToMany(() => SubMedia, (subMedia) => subMedia.advertising)
  subMedia: SubMedia;
}
