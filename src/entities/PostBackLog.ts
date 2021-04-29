import { Advertising } from 'src/entities/Advertising';
import { Campaign } from '../entities/Campaign';
import { Media } from 'src/entities/Media';
import { SubMedia } from '../entities/SubMedia';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tracker } from './Tracker';

@Entity('mcp_postback_log')
export class PostBackLog {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: string;

  @Column({
    type: 'nvarchar',
    name: 'campaignToken',
    nullable: true,
  })
  campaignToken: string;

  @Column({ type: 'nvarchar', name: 'viewCode', nullable: true })
  viewCode: string;

  @Column({ type: 'nvarchar', name: 'type', nullable: true })
  type: string;

  @Column({ type: 'nvarchar', name: 'platform', nullable: true })
  platform: string;

  @Column({ type: 'nvarchar', name: 'appkey', nullable: true })
  appkey: string;

  @Column({
    type: 'nvarchar',
    name: 'packageName',
    nullable: true,
  })
  packageName: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceCountry',
    nullable: true,
  })
  deviceCountry: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceLanguage',
    nullable: true,
  })
  deviceLanguage: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceCarrier',
    nullable: true,
  })
  deviceCarrier: string;

  @Column({ type: 'nvarchar', name: 'deviceIp', nullable: true })
  deviceIp: string;

  @Column({ type: 'nvarchar', name: 'userAgent', nullable: true })
  userAgent: string;

  @Column({ type: 'nvarchar', name: 'deviceId', nullable: true })
  deviceId: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceAndroidId',
    nullable: true,
  })
  deviceAndroidId: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceIosId',
    nullable: true,
  })
  deviceIosId: string;

  @Column({ type: 'nvarchar', name: 'clickId', nullable: true })
  clickId: string;

  @Column({ type: 'datetime', name: 'clickDatetime', nullable: true })
  clickDatetime: Date;

  @Column({ type: 'datetime', name: 'installDatetime', nullable: true })
  installDatetime: Date;

  @Column({ type: 'datetime', name: 'eventDatetime', nullable: true })
  eventDatetime: Date;

  @Column({ type: 'datetime', name: 'mediaSendDatetime', nullable: true })
  mediaSendDatetime: Date;

  @Column({ type: 'nvarchar', name: 'eventName', nullable: true })
  eventName: string;

  @Column({ type: 'nvarchar', name: 'mediaSendUrl', nullable: true })
  mediaSendUrl: string;

  @Column({ type: 'nvarchar', name: 'productId', nullable: true })
  productId: string;

  @Column({ type: 'integer', name: 'price', nullable: true })
  price: number;

  @Column({ type: 'nvarchar', name: 'currency', nullable: true })
  currency: string;

  @Column({
    type: 'nvarchar',
    name: 'originalUrl',
    nullable: true,
    length: 2000,
  })
  originalUrl: string;

  @Column({ type: 'date', name: 'registeredAt', nullable: true })
  registeredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Tracker, (tracker) => tracker.postBackLog)
  @JoinColumn({ name: 'tracker' })
  tracker: Tracker;

  @ManyToOne(() => Media, (media) => media.postBackLog)
  @JoinColumn({ name: 'media' })
  media: Media;

  @ManyToOne(() => Advertising, (advertising) => advertising.postBackLog)
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.postBackLog)
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;

  @ManyToOne(() => SubMedia, (subMedia) => subMedia.postBackLog)
  @JoinColumn({ name: 'subMedia' })
  subMedia: SubMedia;
}
