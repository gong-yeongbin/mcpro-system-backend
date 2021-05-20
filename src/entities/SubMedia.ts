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
} from 'typeorm';

@Entity('mcp_submedia')
@Unique(['viewCode'])
export class SubMedia {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: string;

  @Column({ type: 'nvarchar', name: 'cp_token' })
  cpToken: string;

  @Column({ type: 'nvarchar', name: 'pub_id' })
  pubId: string;

  @Column({ type: 'nvarchar', name: 'sub_id', nullable: true })
  subId: string;

  @Column({ type: 'nvarchar', name: 'view_code' })
  viewCode: string;

  @Column({
    type: 'bigint',
    name: 'click',
    nullable: true,
    default: 0,
  })
  click: number;

  @Column({
    type: 'bigint',
    name: 'install',
    nullable: true,
    default: 0,
  })
  install: number;

  @Column({
    type: 'bigint',
    name: 'signup',
    nullable: true,
    default: 0,
  })
  signup: number;

  @Column({
    type: 'bigint',
    name: 'retention',
    nullable: true,
    default: 0,
  })
  retention: number;

  @Column({ type: 'bigint', name: 'buy', nullable: true, default: 0 })
  buy: number;

  @Column({
    type: 'bigint',
    name: 'price',
    nullable: true,
    default: 0,
  })
  price: number;

  @Column({
    type: 'bigint',
    name: 'etc1',
    nullable: true,
    default: 0,
  })
  etc1: number;

  @Column({
    type: 'bigint',
    name: 'etc2',
    nullable: true,
    default: 0,
  })
  etc2: number;

  @Column({
    type: 'bigint',
    name: 'etc3',
    nullable: true,
    default: 0,
  })
  etc3: number;

  @Column({
    type: 'bigint',
    name: 'etc4',
    nullable: true,
    default: 0,
  })
  etc4: number;

  @Column({
    type: 'bigint',
    name: 'etc5',
    nullable: true,
    default: 0,
  })
  etc5: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.subMedia)
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Campaign, (campaign) => campaign.subMedia)
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;

  @ManyToOne(() => Media, (media) => media.subMedia)
  @JoinColumn({ name: 'media' })
  media: Media;
}
