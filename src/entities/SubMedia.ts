import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('submedia')
export class SubMedia {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'idx' })
  idx: number;

  @Column({ type: 'nvarchar', name: 'cp_token' })
  cp_token: string;

  @Column({ type: 'nvarchar', name: 'view_code' })
  view_code: string;

  @Column({ type: 'nvarchar', name: 'pub_id' })
  pub_id: string;

  @Column({ type: 'nvarchar', name: 'sub_id', nullable: true })
  sub_id: string;

  @Column({ type: 'nvarchar', name: 'md_code' })
  md_code: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
