import { Advertising } from '../entities/Advertising';
import { Campaign } from '../entities/Campaign';
import { PostBackLog } from '../entities/PostBackLog';
import { Media } from '../entities/Media';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CampaignDaily } from './CampaignDaily';

@Entity('mcp_submedia')
@Unique(['viewCode'])
export class SubMedia {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: string;

  @Column({ type: 'nvarchar', name: 'cp_token' })
  cpToken: string;

  @Column({ type: 'nvarchar', name: 'pub_id' })
  pubId: string;

  @Column({ type: 'nvarchar', name: 'sub_id', nullable: true })
  subId: string;

  @Column({ type: 'nvarchar', name: 'view_code' })
  viewCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.subMedia)
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.subMedia)
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;

  @ManyToOne(() => Media, (media) => media.subMedia)
  @JoinColumn({ name: 'media' })
  media: Media;

  @OneToMany(() => PostBackLog, (postBackLog) => postBackLog.subMedia)
  postBackLog: PostBackLog;

  @OneToMany(() => CampaignDaily, (campaignDaily) => campaignDaily.subMedia)
  campaignDaily: CampaignDaily;
}
