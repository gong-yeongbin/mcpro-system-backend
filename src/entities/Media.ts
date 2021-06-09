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
@Unique(['md_code'])
export class Media {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'md_code' })
  md_code: string;

  @Column({ type: 'nvarchar', name: 'md_name' })
  md_name: string;

  @Column({
    type: 'boolean',
    name: 'md_status',
    default: true,
  })
  md_status: boolean;

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
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => SubMedia, (subMedia) => subMedia.media)
  subMedia: SubMedia;

  @OneToMany(() => Campaign, (campaign) => campaign.media)
  campaign: Campaign;
}
