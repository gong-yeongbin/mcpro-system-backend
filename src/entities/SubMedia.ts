import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Campaign } from './Campaign';

@Entity('submedia')
export class SubMedia {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'view_code' })
  view_code: string;

  @Column({ type: 'nvarchar', name: 'pub_id' })
  pub_id: string;

  @Column({ type: 'nvarchar', name: 'sub_id', nullable: true })
  sub_id: string;

  @Column({ type: 'bigint', name: 'count' })
  count: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.subMedia)
  @JoinColumn({ name: 'campain' })
  campaign: Campaign;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
