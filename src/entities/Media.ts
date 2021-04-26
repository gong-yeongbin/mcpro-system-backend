import { PostBackLog } from '../entities/PostBackLog';
import { SubMedia } from '../entities/SubMedia';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Campaign } from './Campaign';
import { CampaignDaily } from './CampaignDaily';

@Entity('mcp_media')
@Unique(['mdCode'])
export class Media {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'md_code' })
  mdCode: string;

  @Column({ type: 'nvarchar', name: 'md_name' })
  mdName: string;

  @Column({
    type: 'boolean',
    name: 'md_status',
    default: true,
  })
  mdStatus: boolean;

  @Column({
    type: 'nvarchar',
    name: 'mediaPostbackInstallUrlTemplate',
  })
  mediaPostbackInstallUrlTemplate: string;

  @Column({
    type: 'nvarchar',
    name: 'mediaPostbackEventUrlTemplate',
  })
  mediaPostbackEventUrlTemplate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.media)
  campaign: Campaign[];

  @OneToMany(() => SubMedia, (subMedia) => subMedia.media)
  subMedia: SubMedia;

  @OneToMany(() => PostBackLog, (postBackLog) => postBackLog.media)
  postBackLog: PostBackLog;

  @OneToMany(() => CampaignDaily, (campaignDaily) => campaignDaily.media)
  campaignDaily: CampaignDaily;
}
