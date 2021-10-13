import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from '@entities/Entity';

@Index('token', ['token'], {})
@Entity('postback_campaign_daily', { schema: 'mcpro' })
export default class PostbackCampaignDaily {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('int', { name: 'click', nullable: true, default: () => "'0'" })
  public click: number | null;

  @Column('int', { name: 'install', nullable: true, default: () => "'0'" })
  public install: number | null;

  @Column('int', { name: 'registration', nullable: true, default: () => "'0'" })
  public registration: number | null;

  @Column('int', { name: 'retention', nullable: true, default: () => "'0'" })
  public retention: number | null;

  @Column('int', { name: 'purchase', nullable: true, default: () => "'0'" })
  public purchase: number | null;

  @Column('int', { name: 'revenue', nullable: true, default: () => "'0'" })
  public revenue: number | null;

  @Column('int', { name: 'etc1', nullable: true, default: () => "'0'" })
  public etc1: number | null;

  @Column('int', { name: 'etc2', nullable: true, default: () => "'0'" })
  public etc2: number | null;

  @Column('int', { name: 'etc3', nullable: true, default: () => "'0'" })
  public etc3: number | null;

  @Column('int', { name: 'etc4', nullable: true, default: () => "'0'" })
  public etc4: number | null;

  @Column('int', { name: 'etc5', nullable: true, default: () => "'0'" })
  public etc5: number | null;

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
