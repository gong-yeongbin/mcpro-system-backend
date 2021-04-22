import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Advertising } from './Advertising';
import { Media } from './Media';
import { PostBackEvent } from './PostBackEvent';
import { Reservation } from './Reservation';
import { SubMedia } from '../entities/SubMedia';
import { PostBackLog } from 'src/entities/PostBackLog';

@Entity('mcp_campaign')
@Unique(['cpCode', 'cpToken'])
export class Campaign {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'cp_token', length: 45 })
  cpToken: string;

  @Column({ type: 'nvarchar', name: 'cp_appkey', length: 20 })
  cpAppkey: string;

  @Column({
    type: 'nvarchar',
    name: 'cp_code',
    length: 20,
  })
  cpCode: string;

  @Column({ type: 'nvarchar', name: 'cp_name', length: 45 })
  cpName: string;

  @Column({ type: 'nvarchar', name: 'type', length: 10 })
  type: string;

  @Column({ type: 'nvarchar', name: 'trackerTrackingUrl', length: 200 })
  trackerTrackingUrl: string;

  @Column({ type: 'nvarchar', name: 'mecrossTrackingUrl', length: 200 })
  mecrossTrackingUrl: string;

  @Column({
    type: 'boolean',
    name: 'trackerTrackingStatus',
    default: false,
  })
  trackerTrackingStatus: boolean;

  @Column({
    type: 'boolean',
    name: 'mecrossTrackingStatus',
    default: false,
  })
  mecrossTrackingStatus: boolean;

  @Column({
    type: 'boolean',
    name: 'cp_status',
    default: true,
  })
  cpStatus: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.campaign, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  advertising: Advertising;

  @ManyToOne(() => Media, (media) => media.campaign, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  media: Media;

  @OneToMany(() => PostBackEvent, (postBackEvent) => postBackEvent.campaign)
  postBackEvent: PostBackEvent[];

  @OneToMany(() => Reservation, (reservation) => reservation.campaign)
  reservation: Reservation[];

  @OneToMany(() => SubMedia, (subMedia) => subMedia.cpCode)
  subMedia: SubMedia;

  @OneToMany(() => PostBackLog, (postBackLog) => postBackLog.cpCode)
  postBackLog: PostBackLog;
}
