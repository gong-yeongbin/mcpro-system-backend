import { Advertising } from '../entities/Advertising';
import { Campaign } from '../entities/Campaign';
import { Media } from '../entities/Media';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PostBackUnregisteredEvent } from './PostBackUnregisteredEvent';

export interface SubMediaMetaData {
  cp_token: string;
  pub_id: string;
  sub_id?: string;
  view_code: string;
  click?: number;
  install?: number;
  signup?: number;
  retention?: number;
  buy?: number;
  price?: number;
  etc1?: number;
  etc2?: number;
  etc3?: number;
  etc4?: number;
  etc5?: number;
  advertising: Advertising;
  campaign: Campaign;
  media: Media;
}
@Entity('mcp_submedia')
@Unique(['view_code'])
export class SubMedia {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: string;

  @Column({ type: 'nvarchar', name: 'cp_token' })
  cp_token: string;

  @Column({ type: 'nvarchar', name: 'pub_id' })
  pub_id: string;

  @Column({ type: 'nvarchar', name: 'sub_id', nullable: true })
  sub_id: string;

  @Column({ type: 'nvarchar', name: 'view_code' })
  view_code: string;

  @Column({
    type: 'int',
    name: 'click',
    nullable: true,
    default: 0,
  })
  click: number;

  @Column({
    type: 'int',
    name: 'install',
    nullable: true,
    default: 0,
  })
  install: number;

  @Column({
    type: 'int',
    name: 'signup',
    nullable: true,
    default: 0,
  })
  signup: number;

  @Column({
    type: 'int',
    name: 'retention',
    nullable: true,
    default: 0,
  })
  retention: number;

  @Column({ type: 'int', name: 'buy', nullable: true, default: 0 })
  buy: number;

  @Column({
    type: 'int',
    name: 'price',
    nullable: true,
    default: 0,
  })
  price: number;

  @Column({
    type: 'int',
    name: 'etc1',
    nullable: true,
    default: 0,
  })
  etc1: number;

  @Column({
    type: 'int',
    name: 'etc2',
    nullable: true,
    default: 0,
  })
  etc2: number;

  @Column({
    type: 'int',
    name: 'etc3',
    nullable: true,
    default: 0,
  })
  etc3: number;

  @Column({
    type: 'int',
    name: 'etc4',
    nullable: true,
    default: 0,
  })
  etc4: number;

  @Column({
    type: 'int',
    name: 'etc5',
    nullable: true,
    default: 0,
  })
  etc5: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.subMedia)
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.subMedia)
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;

  @ManyToOne(() => Media, (media) => media.subMedia)
  @JoinColumn({ name: 'media' })
  media: Media;

  @OneToMany(
    () => PostBackUnregisteredEvent,
    (postBackUnregisteredEvent) => postBackUnregisteredEvent.subMedia,
    { nullable: true },
  )
  postBackUnregisteredEvent: PostBackUnregisteredEvent[];
}
