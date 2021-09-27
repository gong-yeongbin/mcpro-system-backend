import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advertiser, Campaign, Tracker } from './Entity';

@Entity('advertising', { schema: 'mcpro' })
export default class Advertising {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  public name: string | null;

  @Column('varchar', { name: 'platform', length: 255 })
  public platform: string;

  @Column('varchar', { name: 'image_url', nullable: true, length: 255 })
  public imageUrl: string | null;

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

  @OneToMany(() => Campaign, (campaign) => campaign.advertising)
  public campaign: Campaign[];

  @ManyToOne(() => Advertiser, (advertiser) => advertiser.advertising, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'advertiser', referencedColumnName: 'idx' }])
  public advertiser: Advertiser;

  @ManyToOne(() => Tracker, (tracker) => tracker.advertising, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'tracker', referencedColumnName: 'idx' }])
  public tracker: Tracker;
}
