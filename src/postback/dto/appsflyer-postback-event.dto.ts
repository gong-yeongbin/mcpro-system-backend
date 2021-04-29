import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class AppsflyerPostbackEventDto {
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
  idfv: string;

  @IsString()
  @IsOptional()
  install_time: string;

  @IsString()
  @IsOptional()
  country_code: string;

  @IsString()
  @IsOptional()
  language: string;

  @IsString()
  @IsOptional()
  event_name: string;

  @IsString()
  @IsOptional()
  event_revenue_currency: string;

  @IsNumberString()
  @IsOptional()
  event_revenue: number;

  @IsString()
  @IsOptional()
  event_time: string;

  @IsString()
  @IsOptional()
  device_carrier: string;
}
