import {
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Campaign } from './Campaign';

@Entity('postback_event')
export class PostBackEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'trackerPostback' })
  trackerPostback: string;

  @Column({ type: 'nvarchar', name: 'adminPostback' })
  adminPostback: string;

  @Column({ type: 'nvarchar', name: 'mediaPostback' })
  mediaPostback: string;

  @Column({ type: 'boolean', name: 'sendPostback', default: true })
  sendPostback: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.postBackEvent)
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;
}
