import {
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  PrimaryColumn,
} from 'typeorm';
import { Advertising } from './Advertising';

@Entity('advertiser')
@Unique(['ar_code', 'ar_name'])
export class Advertiser {
  @PrimaryColumn({ type: 'nvarchar', name: 'ar_code' })
  ar_code: string;

  @Column({ type: 'nvarchar', name: 'ar_name' })
  ar_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.advertiser, {
    cascade: true,
  })
  advertising: Advertising[];
}
