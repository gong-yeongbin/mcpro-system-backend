import { IsOptional, IsString } from 'class-validator';

export class AppsflyerPostbackInstallDto {
  @IsString() //클릭id
  @IsOptional()
  clickid: string;

  @IsString() //노출용코드
  @IsOptional()
  af_siteid: string;

  @IsString() //캠페인토큰
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
  click_time: string;

  @IsString()
  @IsOptional()
  device_carrier: string;

  @IsString()
  @IsOptional()
  device_ip: string;
}
