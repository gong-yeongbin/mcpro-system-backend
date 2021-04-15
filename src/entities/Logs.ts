import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('idx_logs_type_name', ['type', 'name'], { unique: true })
@Index(
  'idx_logs_status_registeredAt_type',
  ['status', 'registeredAt', 'type'],
  {},
)
@Entity('logs', { schema: 'mecrosspro' })
export class Logs {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('varchar', { name: 'type', length: 10 })
  public type: string;

  @Column('varchar', { name: 'name', length: 100 })
  public name: string;

  @Column('datetime', { name: 'fileTime' })
  public fileTime: Date;

  @Column('varchar', { name: 'fileSize', length: 100 })
  public fileSize: string;

  @Column('varchar', { name: 'status', length: 10 })
  public status: string;

  @Column('datetime', { name: 'registeredAt' })
  public registeredAt: Date;

  @Column('datetime', { name: 'createdAt' })
  public createdAt: Date;

  @Column('datetime', { name: 'updatedAt' })
  public updatedAt: Date;
}
