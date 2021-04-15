import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('submedia')
@Unique(['viewCode'])
export class SubMedia {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ type: 'nvarchar', name: 'campaignToken', length: 30 })
  campaignToken: string;

  @Column({ type: 'nvarchar', name: 'mediaCode', length: 30 })
  mediaCode: string;

  @Column({ type: 'nvarchar', name: 'submediaCode', length: 150 })
  submediaCode: string;

  @Column({ type: 'nvarchar', name: 'viewCode', unique: true, length: 30 })
  viewCode: string;

  @Column({ type: 'nvarchar', name: 'trackerCode', length: 30 })
  trackerCode: string;

  @Column({ type: 'nvarchar', name: 'advertisingCode', length: 30 })
  advertisingCode: string;

  @Column({ type: 'nvarchar', name: 'campaignCode', length: 30 })
  campaignCode: string;

  @Column({ name: 'registeredAt' })
  registeredAt: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
