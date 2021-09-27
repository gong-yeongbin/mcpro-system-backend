import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('submedia', { schema: 'mcpro' })
export default class Submedia {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'token', length: 255 })
  public token: string;

  @Column('varchar', { name: 'pub_id', length: 255 })
  public pubId: string;

  @Column('varchar', { name: 'sub_id', nullable: true, length: 255 })
  public subId: string | null;

  @Column('varchar', { name: 'media', length: 255 })
  public media: string;

  @Column('varchar', { name: 'view_code', length: 255 })
  public viewCode: string;

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
}
