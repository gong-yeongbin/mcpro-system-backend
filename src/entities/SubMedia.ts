import { Advertising } from '../entities/Advertising';
import { Campaign } from '../entities/Campaign';
import { PostBackLog } from '../entities/PostBackLog';
import { Media } from '../entities/Media';
import { Tracker } from '../entities/Tracker';
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

@Entity('mcp_submedia')
@Unique(['viewCode'])
export class SubMedia {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: string;

  @Column({ type: 'nvarchar', name: 'cp_token', length: 45 })
  cpToken: string;

  @Column({ type: 'nvarchar', name: 'sb_code', length: 150 })
  sbCode: string;

  @Column({ type: 'nvarchar', name: 'view_code', length: 30 })
  viewCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tracker, (tracker) => tracker.subMedia)
  @JoinColumn({ name: 'tk_code' })
  tkCode: Tracker;

  @ManyToOne(() => Advertising, (advertising) => advertising.subMedia)
  @JoinColumn({ name: 'ad_code' })
  adCode: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.subMedia)
  @JoinColumn({ name: 'cp_code' })
  cpCode: Campaign;

  @ManyToOne(() => Media, (media) => media.subMedia)
  @JoinColumn({ name: 'md_code' })
  mdCode: Media;

  @OneToMany(() => PostBackLog, (postBackLog) => postBackLog.sbCode)
  postBackLog: PostBackLog;
}
