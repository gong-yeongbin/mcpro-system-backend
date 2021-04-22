import {
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Campaign } from './Campaign';

@Entity('mcp_postback_event')
export class PostBackEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'trackerPostback', length: 45 })
  trackerPostback: string;

  @Column({ type: 'nvarchar', name: 'adminPostback', length: 45 })
  adminPostback: string;

  @Column({ type: 'nvarchar', name: 'mediaPostback', length: 45 })
  mediaPostback: string;

  @Column({ type: 'boolean', name: 'sendPostback', default: true })
  sendPostback: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.postBackEvent, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  campaign: Campaign;
}
