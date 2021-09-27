import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostbackUnregisteredEvent } from './Entity';

@Entity('postback_daily', { schema: 'mcpro' })
export default class PostbackDaily {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', { name: 'token', nullable: true, length: 255 })
  public token: string | null;

  @Column('varchar', { name: 'pub_id', length: 255 })
  public pubId: string;

  @Column('varchar', { name: 'sub_id', nullable: true, length: 255 })
  public subId: string | null;

  @Column('varchar', { name: 'view_code', nullable: true, length: 255 })
  public viewCode: string | null;

  @Column('int', { name: 'click', nullable: true, default: () => "'0'" })
  public click: number | null;

  @Column('int', { name: 'install', nullable: true, default: () => "'0'" })
  public install: number | null;

  @Column('int', { name: 'registration', nullable: true, default: () => "'0'" })
  public registration: number | null;

  @Column('int', { name: 'retention', nullable: true, default: () => "'0'" })
  public retention: number | null;

  @Column('int', { name: 'purchase', nullable: true, default: () => "'0'" })
  public purchase: number | null;

  @Column('int', { name: 'revenue', nullable: true, default: () => "'0'" })
  public revenue: number | null;

  @Column('int', { name: 'etc1', nullable: true, default: () => "'0'" })
  public etc1: number | null;

  @Column('int', { name: 'etc2', nullable: true, default: () => "'0'" })
  public etc2: number | null;

  @Column('int', { name: 'etc3', nullable: true, default: () => "'0'" })
  public etc3: number | null;

  @Column('int', { name: 'etc4', nullable: true, default: () => "'0'" })
  public etc4: number | null;

  @Column('int', { name: 'etc5', nullable: true, default: () => "'0'" })
  public etc5: number | null;

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

  @OneToMany(() => PostbackUnregisteredEvent, (postbackUnregisteredEvent) => postbackUnregisteredEvent.postbackDaily)
  public postbackUnregisteredEvent: PostbackUnregisteredEvent[];
}
