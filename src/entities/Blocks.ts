import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(
  'blocks_campaign_token_submedia_code',
  ['campaignToken', 'submediaCode'],
  {},
)
@Entity('blocks', { schema: 'mecrosspro' })
export class Blocks {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('varchar', { name: 'campaignToken', length: 30 })
  public campaignToken: string;

  @Column('varchar', { name: 'submediaCode', length: 500 })
  public submediaCode: string;

  @Column('varchar', { name: 'campaignCode', length: 30 })
  public campaignCode: string;

  @Column('varchar', { name: 'mediaCode', length: 30 })
  public mediaCode: string;

  @Column('datetime', { name: 'createdAt' })
  public createdAt: Date;

  @Column('datetime', { name: 'updatedAt' })
  public updatedAt: Date;
}
