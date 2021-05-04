import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('mcp_postback_install_adbrixremaster')
export class PostBackInstallAdbrixRemaster {
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

  @Column({ name: 'attr_type', type: 'nvarchar' })
  attrType: string;

  @Column({ name: 'event_name', type: 'nvarchar' })
  eventName: string;

  @Column({ name: 'event_datetime', type: 'nvarchar' })
  eventDatetime: string;

  @Column({ name: 'deeplink_path', type: 'nvarchar' })
  deeplinkPath: string;

  @Column({
    name: 'market_install_btn_clicked',
    type: 'nvarchar',
  })
  marketInstallBtnClicked: string;

  @Column({ name: 'app_install_start', type: 'nvarchar' })
  appInstallStart: string;

  @Column({ name: 'app_install_completed', type: 'nvarchar' })
  appInstallCompleted: string;

  @Column({ name: 'app_first_open', type: 'nvarchar' })
  appFirstOpen: string;

  @Column({ name: 'seconds_gap', type: 'nvarchar' })
  secondsGap: string;

  //캠페인 토큰
  @Column({ name: 'cb_1', type: 'nvarchar' })
  cb1: string;

  //노출코드
  @Column({ name: 'cb_2', type: 'nvarchar' })
  cb2: string;

  //click id
  @Column({ name: 'cb_3', type: 'nvarchar' })
  cb3: string;

  @Column({ name: 'cb_4', type: 'nvarchar' })
  cb4: string;

  @Column({ name: 'cb_5', type: 'nvarchar' })
  cb5: string;

  @Column({ name: 'pbUrl', type: 'text' })
  pbUrl: string;

  @Column({ name: 'isSendDate', type: 'datetime', nullable: true })
  isSendDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
