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
import { Postback } from './Postback';
import { Reservation } from './Reservation';

@Entity('campaign')
@Unique(['code', 'token'])
export class Campaign {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'token' })
  token: string;

  @Column({ type: 'nvarchar', name: 'appkey' })
  appkey: string;

  @Column({
    type: 'nvarchar',
    name: 'code',
    nullable: true,
  })
  code: string;

  @Column({ type: 'nvarchar', name: 'name' })
  name: string;

  @Column({ type: 'nvarchar', name: 'type' })
  type: string;

  @Column({ type: 'nvarchar', name: 'trackerTrackingUrl' })
  trackerTrackingUrl: string;

  @Column({ type: 'nvarchar', name: 'mecrossTrackingUrl', nullable: true })
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
    name: 'status',
    default: true,
  })
  status: boolean;

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

  @OneToMany(() => Postback, (postback) => postback.campaign)
  postback: Postback[];

  @OneToMany(() => Reservation, (reservation) => reservation.campaign)
  reservations: Reservation[];
}
