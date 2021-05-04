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
import { CampaignDaily } from './CampaignDaily';

@Entity('mcp_campaign')
@Unique(['cpCode', 'cpToken'])
export class Campaign {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'cp_token' })
  cpToken: string;

  @Column({ type: 'nvarchar', name: 'cp_appkey' })
  cpAppkey: string;

  @Column({
    type: 'nvarchar',
    name: 'cp_code',
    nullable: true,
  })
  cpCode: string;

  @Column({ type: 'nvarchar', name: 'cp_name' })
  cpName: string;

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
  cpStatus: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.campaign, {
    onDelete: 'CASCADE',
  })
  advertising: Advertising;

  @ManyToOne(() => Media, (media) => media.campaign, {
    onDelete: 'CASCADE',
  })
  media: Media;

  @OneToMany(() => PostBackEvent, (postBackEvent) => postBackEvent.campaign)
  postBackEvent: PostBackEvent[];

  @OneToMany(() => Reservation, (reservation) => reservation.campaign)
  reservation: Reservation[];

  @OneToMany(() => SubMedia, (subMedia) => subMedia.campaign)
  subMedia: SubMedia;

  @OneToMany(() => CampaignDaily, (campaignDaily) => campaignDaily.campaign)
  campaignDaily: CampaignDaily;
}
