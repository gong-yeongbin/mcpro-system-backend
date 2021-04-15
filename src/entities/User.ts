import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { UserLog } from './UserLog';

@Entity('user')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'email', length: 50 })
  email: string;

  @Column({ type: 'nvarchar', name: 'password', length: 100 })
  password: string;

  @Column({ type: 'nvarchar', name: 'type', length: 100 })
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserLog, (userLog) => userLog.user)
  @JoinColumn({ name: 'userLog' })
  userLog: UserLog[];
}
