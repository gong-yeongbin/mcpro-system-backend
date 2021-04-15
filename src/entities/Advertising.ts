import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Advertiser } from './Advertiser';
import { Tracker } from './Tracker';
import { Campaign } from './Campaign';
import { Reservation } from './Reservation';

@Entity('advertising')
@Unique(['code'])
export class Advertising {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'code', length: 100 })
  code: string;

  @Column({ type: 'nvarchar', name: 'name', length: 100 })
  name: string;

  @Column({ type: 'nvarchar', name: 'platform', length: 100 })
  platform: string;

  @Column({ type: 'nvarchar', name: 'icon', nullable: true, length: 100 })
  icon: string;

  @Column({ type: 'nvarchar', name: 'type', nullable: true, length: 10 })
  type: string;

  @Column({
    type: 'bigint',
    name: 'price',
    default: 0,
  })
  price: number;

  @Column({
    type: 'boolean',
    name: 'status',
    nullable: true,
    default: true,
  })
  status: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Campaign, (campaign) => campaign.advertising)
  campaign: Campaign[];

  @OneToMany(() => Reservation, (reservation) => reservation.advertising)
  reservation: Reservation[];

  @ManyToOne(() => Advertiser, (advertiser) => advertiser.advertising, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  advertiser: Advertiser;

  @ManyToOne(() => Tracker, (tracker) => tracker.advertising, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  tracker: Tracker;
}
