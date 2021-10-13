import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign, PostbackDaily } from './Entity';

@Entity('postback_unregistered_event', { schema: 'mcpro' })
export default class PostbackUnregisteredEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'event_name', length: 255 })
  public eventName: string;

  @Column('bigint', { name: 'event_count', default: () => 1 })
  public eventCount: number;

  @Column('datetime', {
    name: 'created_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public updatedAt: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.postbackCampaignDaily, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'token', referencedColumnName: 'token' }])
  public token: Campaign;
}
