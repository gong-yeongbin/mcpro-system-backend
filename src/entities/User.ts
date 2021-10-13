import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserLog } from '@entities/Entity';

@Entity('user', { schema: 'mcpro' })
export default class User {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'id', length: 255 })
  public id: string;

  @Column('varchar', { name: 'password', length: 255 })
  public password: string;

  @Column('varchar', { name: 'type', length: 255 })
  public type: string;

  @Column('datetime', {
    name: 'created_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public createdAt: Date;

  @Column('datetime', {
    name: 'updated_at',
    default: () => "'CURRENT_TIMESTAMP(6)'",
  })
  public updatedAt: Date;

  @OneToMany(() => UserLog, (userLog) => userLog.user)
  public userLog: UserLog[];
}
