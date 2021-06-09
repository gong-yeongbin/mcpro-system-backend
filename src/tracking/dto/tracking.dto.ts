import { IsOptional, IsString } from 'class-validator';

export class TrackingDto {
  @IsString()
  @IsOptional()
  token: string;

  @IsString()
  @IsOptional()
  click_id: string;

  @IsString()
  @IsOptional()
  pub_id: string;

  @IsString()
  @IsOptional()
  sub_id: string;

  @IsString()
  @IsOptional()
  adid: string;

  @IsString()
  @IsOptional()
  idfa: string;
}
