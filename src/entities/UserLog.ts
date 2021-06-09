import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../entities/User';

@Entity('mcp_user_log')
export class UserLog {
  @PrimaryGeneratedColumn({ name: 'idx', type: 'bigint' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'ipAddress' })
  ipAddress: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => User, (User) => User.userLog, {
    onDelete: 'CASCADE',
  })
  user: User;
}
