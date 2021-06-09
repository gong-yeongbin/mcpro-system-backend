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
@Unique(['ar_code', 'ar_name'])
export class Advertiser {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'ar_code' })
  ar_code: string;

  @Column({ type: 'nvarchar', name: 'ar_name' })
  ar_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.advertiser, {
    onDelete: 'CASCADE',
  })
  advertising: Advertising[];
}
