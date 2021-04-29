import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class AdbrixPostbackEventDto {
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
}
