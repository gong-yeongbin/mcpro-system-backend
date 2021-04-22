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
import { SubMedia } from '../entities/SubMedia';
import { PostBackLog } from '../entities/PostBackLog';

@Entity('mcp_tracker')
@Unique(['tkCode'])
export class Tracker {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'tk_code', length: 20 })
  tkCode: string;

  @Column({ type: 'nvarchar', name: 'tk_name', length: 45 })
  tkName: string;

  @Column({
    type: 'nvarchar',
    name: 'type',
    length: 10,
    default: 'tracker',
  })
  type: string;

  @Column({ type: 'boolean', name: 'tk_status', default: true })
  tkStatus: boolean;

  @Column({ type: 'nvarchar', name: 'trackerTrackingUrlTemplate', length: 200 })
  trackerTrackingUrlTemplate: string;

  @Column({
    type: 'nvarchar',
    name: 'mecrossPostbackInstallUrlTemplate',
    length: 200,
  })
  mecrossPostbackInstallUrlTemplate: string;

  @Column({
    type: 'nvarchar',
    name: 'mecrossPostbackEventUrlTemplate',
    length: 200,
  })
  mecrossPostbackEventUrlTemplate: string;

  @CreateDateColumn({ name: 'created_At' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_At' })
  updatedAt: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.tracker)
  advertising: Advertising[];

  @OneToMany(() => SubMedia, (subMedia) => subMedia.tkCode)
  subMedia: SubMedia;

  @OneToMany(() => PostBackLog, (postBackLog) => postBackLog.tkCode)
  postBackLog: PostBackLog;
}
