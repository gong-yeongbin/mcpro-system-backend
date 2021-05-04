import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class AdbrixRemasterPostbackEventDto {
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
  attr_adid: string;

  @IsString()
  @IsOptional()
  attr_event_datetime: string;

  @IsNumberString()
  @IsOptional()
  attr_event_timestamp: number;

  @IsString()
  @IsOptional()
  attr_seconds_gap: string;

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
  event_name: string;

  @IsString()
  @IsOptional()
  event_datetime: string;

  @IsNumberString()
  @IsOptional()
  event_timestamp: number;

  @IsString()
  @IsOptional()
  event_timestamp_d: string;

  @IsString()
  @IsOptional()
  param_json: string;

  //캠페인 토큰
  @IsString()
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
