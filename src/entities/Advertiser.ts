import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Advertising } from './Advertising';

@Entity('mcp_advertiser')
@Unique(['arCode', 'arName'])
export class Advertiser {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'ar_code', length: 20 })
  arCode: string;

  @Column({ type: 'nvarchar', name: 'ar_name', length: 45 })
  arName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.advertiser, {
    onDelete: 'CASCADE',
  })
  advertising: Advertising[];
}
