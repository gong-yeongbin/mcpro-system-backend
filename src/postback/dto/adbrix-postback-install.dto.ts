import { IsOptional, IsString } from 'class-validator';

export class AdbrixPostbackInstallDto {
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
  cb_param3: string;

  //노출 코드
  @IsString()
  cb_param4: string;

  @IsString()
  @IsOptional()
  cb_param5: string;
}
