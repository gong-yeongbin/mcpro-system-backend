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

@Entity('advertiser')
@Unique(['code', 'name'])
export class Advertiser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'nvarchar', name: 'code', length: 100 })
  code: string;

  @Column({ type: 'nvarchar', name: 'name', length: 100 })
  name: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Advertising, (advertising) => advertising.advertiser)
  advertising: Advertising[];
}
