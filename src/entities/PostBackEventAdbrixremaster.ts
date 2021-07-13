import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from './Campaign';

@Entity('postback_event_adbrixremaster')
export class PostBackEventAdbrixremaster {
  @PrimaryGeneratedColumn({ name: 'idx', type: 'bigint' })
  idx: number;

  @Column({ name: 'view_code', type: 'nvarchar' })
  view_code: string;

  @Column({ name: 'a_key', type: 'nvarchar', nullable: true })
  a_key: string;

  @Column({ name: 'a_cookie', type: 'nvarchar', nullable: true })
  a_cookie: string;

  @Column({ name: 'a_ip', type: 'nvarchar', nullable: true })
  a_ip: string;

  @Column({ name: 'a_fp', type: 'nvarchar', nullable: true })
  a_fp: string;

  @Column({ name: 'a_country', type: 'nvarchar', nullable: true })
  a_country: string;

  @Column({ name: 'a_city', type: 'nvarchar', nullable: true })
  a_city: string;

  @Column({ name: 'a_region', type: 'nvarchar', nullable: true })
  a_region: string;

  @Column({ name: 'a_appkey', type: 'nvarchar', nullable: true })
  a_appkey: string;

  @Column({ name: 'm_publisher', type: 'nvarchar', nullable: true })
  m_publisher: string;

  @Column({ name: 'm_sub_publisher', type: 'nvarchar', nullable: true })
  m_sub_publisher: string;

  @Column({ name: 'attr_adid', type: 'nvarchar', nullable: true })
  attr_adid: string;

  @Column({ name: 'attr_event_datetime', type: 'nvarchar', nullable: true })
  attr_event_datetime: string;

  @Column({ name: 'attr_event_timestamp', type: 'nvarchar', nullable: true })
  attr_event_timestamp: string;

  @Column({ name: 'attr_seconds_gap', type: 'nvarchar', nullable: true })
  attr_seconds_gap: string;

  @Column({ name: 'adid', type: 'nvarchar', nullable: true })
  adid: string;

  @Column({ name: 'idfv', type: 'nvarchar', nullable: true })
  idfv: string;

  @Column({ name: 'ad_id_opt_out', type: 'nvarchar', nullable: true })
  ad_id_opt_out: string;

  @Column({ name: 'device_os_version', type: 'nvarchar', nullable: true })
  device_os_version: string;

  @Column({ name: 'device_model', type: 'nvarchar', nullable: true })
  device_model: string;

  @Column({ name: 'device_vendor', type: 'nvarchar', nullable: true })
  device_vendor: string;

  @Column({ name: 'device_resolution', type: 'nvarchar', nullable: true })
  device_resolution: string;

  @Column({ name: 'device_portrait', type: 'nvarchar', nullable: true })
  device_portrait: string;

  @Column({ name: 'device_platform', type: 'nvarchar', nullable: true })
  device_platform: string;

  @Column({ name: 'device_network', type: 'nvarchar', nullable: true })
  device_network: string;

  @Column({ name: 'device_wifi', type: 'nvarchar', nullable: true })
  device_wifi: string;

  @Column({ name: 'device_carrier', type: 'nvarchar', nullable: true })
  device_carrier: string;

  @Column({ name: 'device_language', type: 'nvarchar', nullable: true })
  device_language: string;

  @Column({ name: 'device_country', type: 'nvarchar', nullable: true })
  device_country: string;

  @Column({ name: 'device_build_id', type: 'nvarchar', nullable: true })
  device_build_id: string;

  @Column({ name: 'package_name', type: 'nvarchar', nullable: true })
  package_name: string;

  @Column({ name: 'appkey', type: 'nvarchar', nullable: true })
  appkey: string;

  @Column({ name: 'sdk_version', type: 'nvarchar', nullable: true })
  sdk_version: string;

  @Column({ name: 'installer', type: 'nvarchar', nullable: true })
  installer: string;

  @Column({ name: 'app_version', type: 'nvarchar', nullable: true })
  app_version: string;

  @Column({ name: 'event_name', type: 'nvarchar', nullable: true })
  event_name: string;

  @Column({ name: 'event_datetime', type: 'nvarchar', nullable: true })
  event_datetime: string;

  @Column({ name: 'event_timestamp', type: 'nvarchar', nullable: true })
  event_timestamp: string;

  @Column({ name: 'event_timestamp_d', type: 'nvarchar', nullable: true })
  event_timestamp_d: string;

  @Column({ name: 'param_json', type: 'text', nullable: true })
  param_json: string;

  @Column({ name: 'cb_1', type: 'nvarchar' }) // campaign token
  cb_1: string;

  @Column({ name: 'cb_2', type: 'nvarchar' }) // view code
  cb_2: string;

  @Column({ name: 'cb_3', type: 'nvarchar' }) // click id
  cb_3: string;

  @Column({ name: 'cb_4', type: 'nvarchar', nullable: true })
  cb_4: string;

  @Column({ name: 'cb_5', type: 'nvarchar', nullable: true })
  cb_5: string;

  @Column({ name: 'originalUrl', type: 'text', nullable: true })
  originalUrl: string;

  @Column({ name: 'send_time', type: 'nvarchar', nullable: true })
  send_time: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.postBackEventAdbrixremaster)
  @JoinColumn({ name: 'campaign' })
  campaign: Campaign;
}
