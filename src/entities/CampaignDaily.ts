import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Advertising } from './Advertising';
import { Campaign } from './Campaign';
import { Media } from './Media';
import { SubMedia } from './SubMedia';
import { Tracker } from './Tracker';

@Entity('mcp_campaign_daily')
export class CampaignDaily {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: string;

  @Column({ type: 'nvarchar', name: 'viewCode' })
  viewCode: string;

  @Column({
    type: 'bigint',
    name: 'click',
    default: 0,
  })
  click: number;

  @Column({
    type: 'bigint',
    name: 'install',
    default: 0,
  })
  install: number;

  @Column({
    type: 'bigint',
    name: 'signup',
    default: 0,
  })
  signup: number;

  @Column({
    type: 'bigint',
    name: 'retention',
    default: 0,
  })
  retention: number;

  @Column({ type: 'bigint', name: 'buy', default: 0 })
  buy: number;

  @Column({
    type: 'bigint',
    name: 'price',
    default: 0,
  })
  price: number;

  @Column({
    type: 'bigint',
    name: 'etc1',
    default: 0,
  })
  etc1: number;

  @Column({
    type: 'bigint',
    name: 'etc2',
    default: 0,
  })
  etc2: number;

  @Column({
    type: 'bigint',
    name: 'etc3',
    default: 0,
  })
  etc3: number;

  @Column({
    type: 'bigint',
    name: 'etc4',
    default: 0,
  })
  etc4: number;

  @Column({
    type: 'bigint',
    name: 'etc5',
    default: 0,
  })
  etc5: number;

  @Column({ type: 'date', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'date', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tracker, (tracker) => tracker.campaignDaily)
  @JoinColumn({ name: 'tracker' })
  tracker: Tracker;

  @ManyToOne(() => Media, (media) => media.campaignDaily)
  @JoinColumn({ name: 'media' })
  media: Media;

  @ManyToOne(() => Advertising, (advertising) => advertising.campaignDaily)
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.campaignDaily)
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;

  @ManyToOne(() => SubMedia, (subMedia) => subMedia.campaignDaily)
  @JoinColumn({ name: 'subMedia' })
  subMedia: SubMedia;
}
