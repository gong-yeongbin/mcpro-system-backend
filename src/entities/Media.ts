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

@Entity('media')
@Unique(['code'])
export class Media {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'code', length: 100 })
  code: string;

  @Column({ type: 'nvarchar', name: 'name', length: 100 })
  name: string;

  @Column({ type: 'nvarchar', name: 'mecrossTrackingUrlTemplate' })
  mecrossTrackingUrlTemplate: string;

  @Column({ type: 'nvarchar', name: 'mediaPostbackInstallUrlTemplate' })
  mediaPostbackInstallUrlTemplate: string;

  @Column({ type: 'nvarchar', name: 'mediaPostbackEventUrlTemplate' })
  mediaPostbackEventUrlTemplate: string;

  @Column({
    type: 'boolean',
    name: 'status',
    default: true,
  })
  status: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.media)
  campaign: Campaign[];
}
