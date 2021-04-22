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
    length: 30,
  })
  campaignToken: string;

  @Column({ type: 'nvarchar', name: 'viewCode', nullable: true, length: 30 })
  viewCode: string;

  @Column({ type: 'nvarchar', name: 'type', nullable: true, length: 30 })
  type: string;

  @Column({ type: 'nvarchar', name: 'platform', nullable: true, length: 300 })
  platform: string;

  @Column({ type: 'nvarchar', name: 'appkey', nullable: true, length: 300 })
  appkey: string;

  @Column({
    type: 'nvarchar',
    name: 'packageName',
    nullable: true,
    length: 300,
  })
  packageName: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceCountry',
    nullable: true,
    length: 30,
  })
  deviceCountry: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceLanguage',
    nullable: true,
    length: 30,
  })
  deviceLanguage: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceCarrier',
    nullable: true,
    length: 30,
  })
  deviceCarrier: string;

  @Column({ type: 'nvarchar', name: 'deviceIp', nullable: true, length: 30 })
  deviceIp: string;

  @Column({ type: 'nvarchar', name: 'userAgent', nullable: true, length: 300 })
  userAgent: string;

  @Column({ type: 'nvarchar', name: 'deviceId', nullable: true, length: 100 })
  deviceId: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceAndroidId',
    nullable: true,
    length: 100,
  })
  deviceAndroidId: string;

  @Column({
    type: 'nvarchar',
    name: 'deviceIosId',
    nullable: true,
    length: 100,
  })
  deviceIosId: string;

  @Column({ type: 'nvarchar', name: 'clickId', nullable: true, length: 300 })
  clickId: string;

  @Column('datetime', { name: 'clickDatetime', nullable: true })
  clickDatetime: Date;

  @Column('datetime', { name: 'installDatetime', nullable: true })
  installDatetime: Date;

  @Column('datetime', { name: 'eventDatetime', nullable: true })
  eventDatetime: Date;

  @Column('datetime', { name: 'mediaSendDatetime', nullable: true })
  mediaSendDatetime: Date;

  @Column('varchar', { name: 'eventName', nullable: true, length: 100 })
  eventName: string;

  @Column('varchar', { name: 'mediaSendUrl', nullable: true, length: 1000 })
  mediaSendUrl: string;

  @Column('varchar', { name: 'product', nullable: true, length: 1000 })
  product: string;

  @Column('varchar', { name: 'productId', nullable: true, length: 100 })
  productId: string;

  @Column('varchar', { name: 'price', nullable: true, length: 100 })
  price: string;

  @Column('varchar', { name: 'currency', nullable: true, length: 100 })
  currency: string;

  @Column('varchar', { name: 'firstPurchase', nullable: true, length: 100 })
  firstPurchase: string;

  @Column('text', { name: 'originalUrl', nullable: true })
  originalUrl: string;

  @Column('datetime', { name: 'registeredAt', nullable: true })
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
