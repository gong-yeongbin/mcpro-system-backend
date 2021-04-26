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
import { PostBackLog } from 'src/entities/PostBackLog';
import { CampaignDaily } from './CampaignDaily';

@Entity('mcp_advertising')
@Unique(['adCode'])
export class Advertising {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'ad_code' })
  adCode: string;

  @Column({ type: 'nvarchar', name: 'ad_name' })
  adName: string;

  @Column({ type: 'nvarchar', name: 'ad_platform' })
  adPlatform: string;

  @Column({
    type: 'nvarchar',
    name: 'ad_image_url',
    nullable: true,
  })
  adImageUrl: string;

  @Column({
    type: 'boolean',
    name: 'ad_status',
    default: true,
  })
  adStatus: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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

  @OneToMany(() => PostBackLog, (postBackLog) => postBackLog.advertising)
  postBackLog: PostBackLog;

  @OneToMany(() => CampaignDaily, (campaignDaily) => campaignDaily.advertising)
  campaignDaily: CampaignDaily;
}
