import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('mcp_postback_event_adbrixremaster')
export class PostBackEventAdbrixRemaster {
  @PrimaryGeneratedColumn({ name: 'idx', type: 'bigint' })
  idx: number;

  @Column({ name: 'cp_token', type: 'nvarchar' })
  cpToken: string;

  @Column({ name: 'a_key', type: 'nvarchar' })
  aKey: string;

  @Column({ name: 'a_cookie', type: 'nvarchar' })
  aCookie: string;

  @Column({ name: 'a_ip', type: 'nvarchar' })
  aIp: string;

  @Column({ name: 'a_fp', type: 'nvarchar' })
  aFp: string;

  @Column({ name: 'a_country', type: 'nvarchar' })
  aCountry: string;

  @Column({ name: 'a_city', type: 'nvarchar' })
  aCity: string;

  @Column({ name: 'a_region', type: 'nvarchar' })
  aRegion: string;

  @Column({ name: 'a_appkey', type: 'nvarchar' })
  aAppkey: string;

  @Column({ name: 'm_publisher', type: 'nvarchar' })
  mPublisher: string;

  @Column({ name: 'm_sub_publisher', type: 'nvarchar' })
  mSubPublisher: string;

  @Column({ name: 'attr_adid', type: 'nvarchar' })
  attrAdid: string;

  @Column({ name: 'attr_event_datetime', type: 'nvarchar' })
  attrEventDatetime: string;

  @Column({ name: 'attr_event_timestamp', type: 'nvarchar' })
  attrEventTimestamp: number;

  @Column({ name: 'attr_seconds_gap', type: 'nvarchar' })
  attrSecondsGap: string;

  @Column({ name: 'adid', type: 'nvarchar' })
  adid: string;

  @Column({ name: 'idfv', type: 'nvarchar' })
  idfv: string;

  @Column({ name: 'ad_id_opt_out', type: 'nvarchar' })
  adIdOptOut: string;

  @Column({ name: 'device_os_version', type: 'nvarchar' })
  deviceOsVersion: string;

  @Column({ name: 'device_model', type: 'nvarchar' })
  deviceModel: string;

  @Column({ name: 'device_vendor', type: 'nvarchar' })
  deviceVendor: string;

  @Column({ name: 'device_resolution', type: 'nvarchar' })
  deviceResolution: string;

  @Column({ name: 'device_portrait', type: 'nvarchar' })
  devicePortrait: string;

  @Column({ name: 'device_platform', type: 'nvarchar' })
  devicePlatform: string;

  @Column({ name: 'device_network', type: 'nvarchar' })
  deviceNetwork: string;

  @Column({ name: 'device_wifi', type: 'nvarchar' })
  deviceWifi: string;

  @Column({ name: 'device_carrier', type: 'nvarchar' })
  deviceCarrier: string;

  @Column({ name: 'device_language', type: 'nvarchar' })
  deviceLanguage: string;

  @Column({ name: 'device_country', type: 'nvarchar' })
  deviceCountry: string;

  @Column({ name: 'device_build_id', type: 'nvarchar' })
  deviceBuildId: string;

  @Column({ name: 'package_name', type: 'nvarchar' })
  packageName: string;

  @Column({ name: 'appkey', type: 'nvarchar' })
  appkey: string;

  @Column({ name: 'sdk_version', type: 'nvarchar' })
  sdkVersion: string;

  @Column({ name: 'installer', type: 'nvarchar' })
  installer: string;

  @Column({ name: 'app_version', type: 'nvarchar' })
  appVersion: string;

  @Column({ name: 'event_name', type: 'nvarchar' })
  eventName: string;

  @Column({ name: 'event_datetime', type: 'nvarchar' })
  eventDatetime: string;

  @Column({ name: 'event_timestamp', type: 'bigint' })
  eventTimestamp: number;

  @Column({ name: 'event_timestamp_d', type: 'nvarchar' })
  eventTimestampD: string;

  @Column({
    name: 'param_json',
    type: 'text',
    nullable: true,
  })
  paramJson: string;

  @Column({ name: 'cb_1', type: 'nvarchar' })
  cb1: string;

  @Column({ name: 'cb_2', type: 'nvarchar' })
  cb2: string;

  @Column({ name: 'cb_3', type: 'nvarchar' })
  cb3: string;

  @Column({ name: 'cb_4', type: 'nvarchar' })
  cb4: string;

  @Column({ name: 'cb_5', type: 'nvarchar' })
  cb5: string;

  @Column({ name: 'pbUrl', type: 'text', nullable: true })
  pbUrl: string;

  @Column({ name: 'isSendDate', type: 'datetime', nullable: true })
  isSendDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
