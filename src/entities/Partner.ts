import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PartnerLog } from './PartnerLog';

@Entity('partner')
@Unique(['email', 'code'])
export class Partner {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'email' })
  email: string;

  @Column({ type: 'nvarchar', name: 'password' })
  password: string;

  @Column({ type: 'nvarchar', name: 'type' })
  type: string;

  @Column({
    type: 'nvarchar',
    name: 'code',
    nullable: true,
  })
  code: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => PartnerLog, (partnerLog) => partnerLog.partner)
  partnerLog: PartnerLog[];
}
