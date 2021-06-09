import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface PostBackEventAppsflyerMetaData {
  clickid: string;
  af_siteid: string;
  af_c_id: string;
  advertising_id: string;
  idfa: string;
  idfv: string;
  install_time: string;
  country_code: string;
  language: string;
  event_name: string;
  event_revenue_currency: string;
  event_revenue: string;
  event_time: string;
  device_carrier: string;
  device_ip: string;
  originalUrl: string;
  isSendDate?: Date;
}

@Entity('mcp_postback_event_appsflyer')
export class PostBackEventAppsflyer {
  @PrimaryGeneratedColumn({ name: 'idx', type: 'bigint' })
  idx: number;

  @Column({ name: 'clickid', type: 'nvarchar' })
  clickid: string;

  @Column({ name: 'af_siteid', type: 'nvarchar' })
  af_siteid: string;

  @Column({ name: 'af_c_id', type: 'nvarchar' })
  af_c_id: string;

  @Column({ name: 'advertising_id', type: 'nvarchar', nullable: true })
  advertising_id: string;

  @Column({ name: 'idfa', type: 'nvarchar', nullable: true })
  idfa: string;

  @Column({ name: 'idfv', type: 'nvarchar', nullable: true })
  idfv: string;

  @Column({ name: 'install_time', type: 'nvarchar', nullable: true })
  install_time: string;

  @Column({ name: 'country_code', type: 'nvarchar', nullable: true })
  country_code: string;

  @Column({ name: 'language', type: 'nvarchar', nullable: true })
  language: string;

  @Column({ name: 'event_name', type: 'nvarchar', nullable: true })
  event_name: string;

  @Column({ name: 'event_revenue_currency', type: 'nvarchar', nullable: true })
  event_revenue_currency: string;

  @Column({ name: 'event_revenue', type: 'nvarchar', nullable: true })
  event_revenue: string;

  @Column({ name: 'event_time', type: 'nvarchar', nullable: true })
  event_time: string;

  @Column({ name: 'device_carrier', type: 'nvarchar', nullable: true })
  device_carrier: string;

  @Column({ name: 'device_ip', type: 'nvarchar', nullable: true })
  device_ip: string;

  @Column({ name: 'pbUrl', type: 'text', nullable: true })
  originalUrl: string;

  @Column({ name: 'isSendDate', nullable: true })
  isSendDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
