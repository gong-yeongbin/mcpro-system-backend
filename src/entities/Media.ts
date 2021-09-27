import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from './Entity';

@Entity('media', { schema: 'mcpro' })
export default class Media {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  public name: string | null;

  @Column('tinyint', { name: 'status', default: () => "'1'" })
  public status: number;

  @Column('varchar', { name: 'mediaPostbackInstallUrlTemplate', length: 255 })
  public mediaPostbackInstallUrlTemplate: string;

  @Column('varchar', { name: 'mediaPostbackEventUrlTemplate', length: 255 })
  public mediaPostbackEventUrlTemplate: string;

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

  @OneToMany(() => Campaign, (campaign) => campaign.media)
  public campaign: Campaign[];
}
