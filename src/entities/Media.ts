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

@Entity('mcp_media')
@Unique(['mdCode'])
export class Media {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'md_code', length: 20 })
  mdCode: string;

  @Column({ type: 'nvarchar', name: 'md_name', length: 45 })
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
    length: 200,
  })
  mediaPostbackInstallUrlTemplate: string;

  @Column({
    type: 'nvarchar',
    name: 'mediaPostbackEventUrlTemplate',
    length: 200,
  })
  mediaPostbackEventUrlTemplate: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.media)
  campaign: Campaign[];

  @OneToMany(() => SubMedia, (subMedia) => subMedia.mdCode)
  subMedia: SubMedia;

  @OneToMany(() => PostBackLog, (postBackLog) => postBackLog.tkCode)
  postBackLog: PostBackLog;
}
