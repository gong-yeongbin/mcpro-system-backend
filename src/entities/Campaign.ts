import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import {
  Advertising,
  Media,
  PostBackEvent,
  Reservation,
  PostBackDaily,
  SubMedia,
  PostBackEventAppsflyer,
  PostBackInstallAppsflyer,
  PostBackInstallAdbrixremaster,
  PostBackEventAdbrixremaster,
} from './Entity';

@Entity('campaign')
@Unique(['cp_code', 'cp_token'])
export default class Campaign {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'cp_token' })
  cp_token: string;

  @Column({ type: 'nvarchar', name: 'appkey' })
  appkey: string;

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

  @Column({ type: 'text', name: 'trackerTrackingUrl' })
  trackerTrackingUrl: string;

  @Column({ type: 'text', name: 'mecrossTrackingUrl' })
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

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.campaign)
  @JoinColumn({ name: 'advertising' })
  advertising: Advertising;

  @ManyToOne(() => Media, (media) => media.campaign, { onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'media' })
  media: Media;

  @OneToMany(() => PostBackEvent, (postBackEvent) => postBackEvent.campaign)
  postBackEvent: PostBackEvent[];

  @OneToMany(() => Reservation, (reservation) => reservation.campaign)
  reservation: Reservation[];

  @OneToMany(() => PostBackDaily, (postBackDaily) => postBackDaily.campaign)
  postBackDaily: PostBackDaily[];

  @OneToMany(() => SubMedia, (subMedia) => subMedia.campaign)
  subMedia: SubMedia[];

  @OneToMany(() => PostBackEventAppsflyer, (postBackEventAppsflyer) => postBackEventAppsflyer.campaign)
  postBackEventAppsflyer: PostBackEventAppsflyer[];

  @OneToMany(() => PostBackInstallAppsflyer, (postBackInstallAppsflyer) => postBackInstallAppsflyer.campaign)
  postBackInstallAppsflyer: PostBackInstallAppsflyer[];

  @OneToMany(() => PostBackEventAdbrixremaster, (postBackEventAdbrixremaster) => postBackEventAdbrixremaster.campaign)
  postBackEventAdbrixremaster: PostBackEventAdbrixremaster[];

  @OneToMany(
    () => PostBackInstallAdbrixremaster,
    (postBackInstallAdbrixremaster) => postBackInstallAdbrixremaster.campaign
  )
  postBackInstallAdbrixremaster: PostBackInstallAdbrixremaster[];
}
