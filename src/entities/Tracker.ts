import {
  Column,
  Entity,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Advertising } from './Entity';

@Entity('tracker')
@Unique(['tk_code'])
export default class Tracker {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'tk_code' })
  tk_code: string;

  @Column({ type: 'nvarchar', name: 'tk_name' })
  tk_name: string;

  @Column({
    type: 'nvarchar',
    name: 'type',

    default: 'tracker',
  })
  type: string;

  @Column({ type: 'boolean', name: 'status', default: true })
  status: boolean;

  @Column({ type: 'text', name: 'trackerTrackingUrlTemplate' })
  trackerTrackingUrlTemplate: string;

  @Column({
    type: 'text',
    name: 'mecrossPostbackInstallUrlTemplate',
  })
  mecrossPostbackInstallUrlTemplate: string;

  @Column({
    type: 'text',
    name: 'mecrossPostbackEventUrlTemplate',
  })
  mecrossPostbackEventUrlTemplate: string;

  @CreateDateColumn({ name: 'created_At' })
  created_At: Date;

  @UpdateDateColumn({ name: 'updated_At' })
  updated_At: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.tracker, {
    cascade: true,
  })
  @JoinColumn()
  advertising: Advertising[];
}
