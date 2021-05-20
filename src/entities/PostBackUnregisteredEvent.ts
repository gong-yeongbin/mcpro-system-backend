import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Campaign } from './Campaign';

@Entity('mcp_postback_unregistered_event')
export class PostBackUnregisteredEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'event_name' })
  eventName: string;

  @Column({ type: 'bigint', name: 'event_count', default: 1 })
  eventCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.postBackUnregisteredEvent, {
    onDelete: 'CASCADE',
  })
  campaign: Campaign;
}
