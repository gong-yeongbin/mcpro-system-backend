import { IsOptional, IsString } from 'class-validator';

export class PostbackInstallDto {
  @IsString()
  @IsOptional()
  appkey: string;

  @IsString()
  @IsOptional()
  package_name: string;

  @IsString()
  @IsOptional()
  gaid: string;

  @IsString()
  @IsOptional()
  ifa: string;

  @IsString()
  @IsOptional()
  ifv: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsString()
  @IsOptional()
  network: string;

  @IsString()
  @IsOptional()
  os_ver: string;

  @IsString()
  @IsOptional()
  platform: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  language: string;

  @IsString()
  @IsOptional()
  width: number;

  @IsString()
  @IsOptional()
  height: number;

  @IsString()
  @IsOptional()
  carrier: string;

  @IsString()
  @IsOptional()
  install_dt_kst: string;

  @IsString()
  @IsOptional()
  install_dt_utc: string;

  @IsString()
  @IsOptional()
  is_install_attributed: string;

  @IsString()
  @IsOptional()
  measurement_type: string;

  @IsString()
  @IsOptional()
  installer: string;

  @IsString()
  @IsOptional()
  channel_id: string;

  @IsString()
  @IsOptional()
  channel_name: string;

  @IsString()
  @IsOptional()
  conversion_key: string;

  @IsString()
  @IsOptional()
  conversion_name: string;

  @IsString()
  @IsOptional()
  sub_conversion_key: string;

  @IsString()
  @IsOptional()
  sub_conversion_name: string;

  @IsString()
  @IsOptional()
  event_dt_kst: string;

  @IsString()
  @IsOptional()
  event_dt_utc: string;

  @IsString()
  @IsOptional()
  is_new_user: string;

  @IsString()
  @IsOptional()
  conversion_ip: string;

  @IsString()
  @IsOptional()
  session_dt_kst: string;

  @IsString()
  @IsOptional()
  session_dt_utc: string;

  @IsString()
  @IsOptional()
  session_id: string;

  @IsString()
  @IsOptional()
  click_ip: string;

  @IsString()
  @IsOptional()
  cb_param1: string;

  @IsString()
  @IsOptional()
  cb_param2: string;

  //클릭id
  @IsString()
  @IsOptional()
  cb_param3: string;

  //노출 코드
  @IsString()
  @IsOptional()
  cb_param4: string;

  @IsString()
  @IsOptional()
  cb_param5: string;

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
  sdk_version: string;

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
  @IsOptional()
  cb_2: string;

  //click id
  @IsString()
  @IsOptional()
  cb_3: string;

  @IsString()
  @IsOptional()
  cb_4: string;

  @IsString()
  @IsOptional()
  cb_5: string;

  @IsString()
  @IsOptional()
  a_server_datetime: string;

  //click id
  @IsString()
  @IsOptional()
  clickid: string;

  //노출코드
  @IsString()
  @IsOptional()
  af_siteid: string;

  @IsString()
  @IsOptional()
  af_c_id: string;

  @IsString()
  @IsOptional()
  advertising_id: string;

  @IsString()
  @IsOptional()
  idfa: string;

  @IsString()
  @IsOptional()
  install_time: string;

  @IsString()
  @IsOptional()
  country_code: string;

  @IsString()
  @IsOptional()
  click_time: string;

  @IsString()
  @IsOptional()
  mecross_token: string;

  @IsString()
  @IsOptional()
  mecross_clickid: string;

  @IsString()
  @IsOptional()
  mecross_pubid: string;

  @IsString()
  @IsOptional()
  mecross_subid: string;

  @IsString()
  @IsOptional()
  mecross_gaid: string;

  @IsString()
  @IsOptional()
  mecross_idfa: string;

  @IsString()
  @IsOptional()
  device_brand: string;

  @IsString()
  @IsOptional()
  device_ip: string;

  @IsString()
  @IsOptional()
  click_datetime: string;

  @IsString()
  @IsOptional()
  install_datetime: string;
}
