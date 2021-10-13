import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Advertising } from '@entities/Entity';

@Index('IDX_e72a5d292995a75f0f251b7a7d', ['name'], { unique: true })
@Entity('advertiser', { schema: 'mcpro' })
export default class Advertiser {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  public idx: number;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    unique: true,
    length: 255,
  })
  public name: string | null;

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

  @OneToMany(() => Advertising, (advertising) => advertising.advertiser)
  public advertising: Advertising[];
}
