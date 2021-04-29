import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostbackEventDto {
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
  width: string;

  @IsString()
  @IsOptional()
  height: string;

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
  is_last_attributed: string;

  @IsString()
  @IsOptional()
  event_type_code: string;

  @IsString()
  @IsOptional()
  activity_group: string;

  @IsString()
  @IsOptional()
  activity: string;

  @IsString()
  @IsOptional()
  activity_param: string;

  @IsString()
  @IsOptional()
  order_id: string;

  @IsString()
  @IsOptional()
  product_id: string;

  @IsString()
  @IsOptional()
  product_name: string;

  @IsString()
  @IsOptional()
  price: string;

  @IsString()
  @IsOptional()
  quantity: string;

  @IsNumberString()
  @IsOptional()
  sales: number;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  currency: string;

  @IsString()
  @IsOptional()
  deeplink_url: string;

  @IsString()
  @IsOptional()
  keyword: string;

  @IsString()
  @IsOptional()
  event_dt_kst: string;

  @IsString()
  @IsOptional()
  event_dt_utc: string;

  @IsString()
  @IsOptional()
  install_cb_param1: string;

  @IsString()
  @IsOptional()
  install_cb_param2: string;

  @IsString()
  @IsOptional()
  install_cb_param3: string;

  @IsString()
  @IsOptional()
  install_cb_param4: string;

  @IsString()
  @IsOptional()
  install_cb_param5: string;

  @IsString()
  @IsOptional()
  last_cb_param1: string;

  @IsString()
  @IsOptional()
  last_cb_param2: string;

  @IsString()
  @IsOptional()
  last_cb_param3: string;

  @IsString()
  @IsOptional()
  last_cb_param4: string;

  @IsString()
  @IsOptional()
  last_cb_param5: string;

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

  @IsString()
  @IsOptional()
  cb_1: string;

  @IsString()
  @IsOptional()
  cb_2: string;

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
  clickid: string;

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
  event_revenue_currency: string;

  @IsNumberString()
  @IsOptional()
  event_revenue: number;

  @IsString()
  @IsOptional()
  event_time: string;
}
