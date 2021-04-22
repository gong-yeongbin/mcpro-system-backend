import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserLog } from '../entities/UserLog';

@Entity('mcp_user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'id' })
  id: string;

  @Column({ type: 'nvarchar', name: 'password' })
  password: string;

  @Column({ type: 'nvarchar', name: 'type' })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserLog, (userLog) => userLog.user)
  userLog: UserLog;
}
