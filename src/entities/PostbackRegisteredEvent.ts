import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from '@entities/Entity';

@Entity('postback_registered_event', { schema: 'mcpro' })
export default class PostbackRegisteredEvent {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'tracker', nullable: true, length: 255 })
  public tracker: string | null;

  @Column('varchar', { name: 'admin', nullable: true, length: 255 })
  public admin: string | null;

  @Column('varchar', { name: 'media', nullable: true, length: 255 })
  public media: string | null;

  @Column('tinyint', { name: 'status', default: () => "'1'" })
  public status: boolean;

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
