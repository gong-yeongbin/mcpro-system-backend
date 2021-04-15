import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Advertising } from './Advertising';

@Entity('tracker')
@Unique(['code'])
export class Tracker {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'code', length: 100 })
  code: string;

  @Column({ type: 'nvarchar', name: 'name', length: 100 })
  name: string;

  @Column({
    type: 'nvarchar',
    name: 'type',
    length: 100,
    default: () => "'tracker'",
  })
  type: string;

  @Column({ type: 'nvarchar', name: 'trackerTrackingUrlTemplate' })
  trackerTrackingUrlTemplate: string;

  @Column({ type: 'nvarchar', name: 'mecrossPostbackInstallUrlTemplate' })
  mecrossPostbackInstallUrlTemplate: string;

  @Column({ type: 'nvarchar', name: 'mecrossPostbackEventUrlTemplate' })
  mecrossPostbackEventUrlTemplate: string;

  @Column({ type: 'boolean', name: 'status', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.tracker)
  advertising: Advertising[];
}
