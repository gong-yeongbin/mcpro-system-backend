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
@Unique(['tkCode'])
export class Tracker {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'tk_code' })
  tkCode: string;

  @Column({ type: 'nvarchar', name: 'tk_name' })
  tkName: string;

  @Column({
    type: 'nvarchar',
    name: 'type',

    default: 'tracker',
  })
  type: string;

  @Column({ type: 'boolean', name: 'tk_status', default: true })
  tkStatus: boolean;

  @Column({ type: 'nvarchar', name: 'trackerTrackingUrlTemplate' })
  trackerTrackingUrlTemplate: string;

  @Column({
    type: 'nvarchar',
    name: 'mecrossPostbackInstallUrlTemplate',
  })
  mecrossPostbackInstallUrlTemplate: string;

  @Column({
    type: 'nvarchar',
    name: 'mecrossPostbackEventUrlTemplate',
  })
  mecrossPostbackEventUrlTemplate: string;

  @CreateDateColumn({ name: 'created_At' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_At' })
  updatedAt: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.tracker)
  advertising: Advertising[];
}
