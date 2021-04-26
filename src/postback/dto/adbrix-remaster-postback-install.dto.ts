import { IsOptional, IsString } from 'class-validator';

export class AdbrixRemasterPostbackInstallDto {
  @IsString()
  @IsOptional()
  a_key: string;

  @IsString()
  @IsOptional()
  a_cookie: string;

  @IsString()
  @IsOptional()
  a_ip: string;

  @IsString()
  @IsOptional()
  a_fp: string;

  @IsString()
  @IsOptional()
  a_country: string;

  @IsString()
  @IsOptional()
  a_city: string;

  @IsString()
  @IsOptional()
  a_region: string;

  @IsString()
  @IsOptional()
  a_appkey: string;

  @IsString()
  @IsOptional()
  m_publisher: string;

  @IsString()
  @IsOptional()
  m_sub_publisher: string;

  @IsString()
  @IsOptional()
  adid: string;

  @IsString()
  @IsOptional()
  idfv: string;

  @IsString()
  @IsOptional()
  ad_id_opt_out: string;

  @IsString()
  @IsOptional()
  device_os_version: string;

  @IsString()
  @IsOptional()
  device_model: string;

  @IsString()
  @IsOptional()
  device_vendor: string;

  @IsString()
  @IsOptional()
  device_resolution: string;

  @IsString()
  @IsOptional()
  device_portrait: string;

  @IsString()
  @IsOptional()
  device_platform: string;

  @IsString()
  @IsOptional()
  device_network: string;

  @IsString()
  @IsOptional()
  device_wifi: string;

  @IsString()
  @IsOptional()
  device_carrier: string;

  @IsString()
  @IsOptional()
  device_language: string;

  @IsString()
  @IsOptional()
  device_country: string;

  @IsString()
  @IsOptional()
  device_build_id: string;

  @IsString()
  @IsOptional()
  package_name: string;

  @IsString()
  @IsOptional()
  appkey: string;

  @IsString()
  @IsOptional()
  sdk_version: string;

  @IsString()
  @IsOptional()
  installer: string;

  @IsString()
  @IsOptional()
  app_version: string;

  @IsString()
  @IsOptional()
  attr_type: string;

  @IsString()
  @IsOptional()
  event_name: string;

  @IsString()
  @IsOptional()
  event_datetime: string;

  @IsString()
  @IsOptional()
  deeplink_path: string;

  @IsString()
  @IsOptional()
  market_install_btn_clicked: string;

  @IsString()
  @IsOptional()
  app_install_start: string;

  @IsString()
  @IsOptional()
  app_install_completed: string;

  @IsString()
  @IsOptional()
  app_first_open: string;

  @IsString()
  @IsOptional()
  seconds_gap: string;

  @IsString()
  @IsOptional()
  cb_1: string;

  //노출코드
  @IsString()
  cb_2: string;

  //click id
  @IsString()
  cb_3: string;

  @IsString()
  @IsOptional()
  cb_4: string;

  @IsString()
  @IsOptional()
  cb_5: string;
}
