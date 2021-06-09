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
import { PostBackUnregisteredEvent } from './PostBackUnregisteredEvent';

@Entity('mcp_campaign')
@Unique(['cp_code', 'cp_token'])
export class Campaign {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'cp_token' })
  cp_token: string;

  @Column({ type: 'nvarchar', name: 'cp_appkey' })
  cp_appkey: string;

  @Column({
    type: 'nvarchar',
    name: 'cp_code',
    nullable: true,
  })
  cp_code: string;

  @Column({ type: 'nvarchar', name: 'cp_name' })
  cp_name: string;

  @Column({ type: 'nvarchar', name: 'type' })
  type: string;

  @Column({ type: 'nvarchar', name: 'trackerTrackingUrl' })
  trackerTrackingUrl: string;

  @Column({ type: 'nvarchar', name: 'mecrossTrackingUrl' })
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
  cp_status: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.campaign, {
    onDelete: 'CASCADE',
  })
  advertising: Advertising;

  @ManyToOne(() => Media, (media) => media.campaign)
  media: Media;

  @OneToMany(() => PostBackEvent, (postBackEvent) => postBackEvent.campaign)
  postBackEvent: PostBackEvent[];

  @OneToMany(
    () => PostBackUnregisteredEvent,
    (postBackUnregisteredEvent) => postBackUnregisteredEvent.campaign,
  )
  postBackUnregisteredEvent: PostBackUnregisteredEvent[];

  @ManyToOne(() => Reservation, (reservation) => reservation.campaign)
  reservation: Reservation[];

  @OneToMany(() => SubMedia, (subMedia) => subMedia.campaign)
  subMedia: SubMedia;
}
