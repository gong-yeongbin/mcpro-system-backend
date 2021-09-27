import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advertising } from './Entity';

@Entity('tracker', { schema: 'mcpro' })
export default class Tracker {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  public name: string | null;

  @Column('varchar', { name: 'type', length: 255, default: () => "'tracker'" })
  public type: string;

  @Column('text', { name: 'trackerTrackingUrlTemplate' })
  public trackerTrackingUrlTemplate: string;

  @Column('text', { name: 'mecrossPostbackInstallUrlTemplate' })
  public mecrossPostbackInstallUrlTemplate: string;

  @Column('text', { name: 'mecrossPostbackEventUrlTemplate' })
  public mecrossPostbackEventUrlTemplate: string;

  @Column('tinyint', { name: 'status', default: () => "'1'" })
  public status: number;

  @Column('datetime', {
    name: 'created_At',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public createdAt: Date;

  @Column('datetime', {
    name: 'updated_At',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public updatedAt: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.tracker)
  public advertising: Advertising[];
}
