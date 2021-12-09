import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from '@entities/Entity';

@Entity('reservation', { schema: 'mcpro' })
export default class Reservation {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'oldCampaignName', length: 255 })
  public oldCampaignName: string;

  @Column('varchar', { name: 'newCampaignName', length: 255 })
  public newCampaignName: string;

  @Column('tinyint', { name: 'status', default: () => "'0'" })
  public status: boolean;

  @Column('datetime', {
    name: 'reserved_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public reservedAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public updatedAt: Date;

  @Column('text', { name: 'oldTrackerTrackingUrl' })
  public oldTrackerTrackingUrl: string;

  @Column('text', { name: 'newTrackerTrackingUrl' })
  public newTrackerTrackingUrl: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.reservation, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'campaign', referencedColumnName: 'idx' }])
  public campaign: Campaign;
}
