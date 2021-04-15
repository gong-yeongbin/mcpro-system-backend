import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Partner } from './Partner';

@Entity('partner_log')
export class PartnerLog {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'ipAddress' })
  ipAddress: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ManyToOne(() => Partner, (partner) => partner.partnerLog, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  partner: Partner;
}
