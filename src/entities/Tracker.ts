import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Advertising } from '../entities/Advertising';

@Entity('mcp_tracker')
@Unique(['tk_code'])
export class Tracker {
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

  @Column({ type: 'boolean', name: 'tk_status', default: true })
  tk_status: boolean;

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

  @OneToMany(() => Advertising, (advertising) => advertising.tracker)
  advertising: Advertising[];
}
