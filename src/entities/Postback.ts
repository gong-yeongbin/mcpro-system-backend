import {
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Campaign } from './Campaign';

@Entity('postback')
export class Postback {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'trackerPostback', length: 100 })
  trackerPostback: string;

  @Column({ type: 'nvarchar', name: 'adminPostback', length: 100 })
  adminPostback: string;

  @Column({ type: 'nvarchar', name: 'mediaPostback', length: 100 })
  mediaPostback: string;

  @Column({
    type: 'nvarchar',
    name: 'exceptionColumn',
    nullable: true,
    length: 100,
  })
  exceptionColumn: string;

  @Column({ type: 'nvarchar', name: 'sendPostback', length: 10 })
  sendPostback: string;

  @Column({
    type: 'nvarchar',
    name: 'sendSalesAmount',
    nullable: true,
    length: 10,
  })
  sendSalesAmount: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.postback, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  campaign: Campaign;
}
