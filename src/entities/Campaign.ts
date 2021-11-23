import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advertising, Media, PostbackRegisteredEvent, Reservation } from '@entities/Entity';

@Index('IDX_1ab622056fec78ded2dccbf2ce', ['token'], { unique: true })
@Entity('campaign', { schema: 'mcpro' })
export default class Campaign {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', {
    name: 'token',
    nullable: true,
    unique: true,
    length: 255,
  })
  public token: string | null;

  @Column('varchar', { name: 'appkey', length: 255 })
  public appkey: string;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  public name: string | null;

  @Column('varchar', { name: 'type', length: 255 })
  public type: string;

  @Column('tinyint', { name: 'trackerTrackingStatus', default: () => "'0'" })
  public trackerTrackingStatus: number;

  @Column('tinyint', { name: 'mecrossTrackingStatus', default: () => "'0'" })
  public mecrossTrackingStatus: number;

  @Column('tinyint', { name: 'status', default: () => "'1'" })
  public status: boolean;

  @Column('text', { name: 'trackerTrackingUrl' })
  public trackerTrackingUrl: string;

  @Column('text', { name: 'mecrossTrackingUrl' })
  public mecrossTrackingUrl: string;

  @Column('datetime', {
    name: 'updated_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public updatedAt: Date;

  @Column('datetime', {
    name: 'created_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public createdAt: Date;

  @ManyToOne(() => Advertising, (advertising) => advertising.campaign, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'advertising', referencedColumnName: 'idx' }])
  public advertising: Advertising;

  @OneToMany(() => Reservation, (reservation) => reservation.campaign)
  public reservations: Reservation[];

  @ManyToOne(() => Media, (media) => media.campaign, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'media', referencedColumnName: 'idx' }])
  public media: Media;

  @OneToMany(() => PostbackRegisteredEvent, (postbackRegisteredEvent) => postbackRegisteredEvent.token)
  public postbackRegisteredEvent: PostbackRegisteredEvent[];
}
