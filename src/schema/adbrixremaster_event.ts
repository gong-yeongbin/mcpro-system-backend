import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdbrixremasterEventDocument = AdbrixremasterEvent & Document;

@Schema({ versionKey: false, collection: 'adbrixremaster_event' })
export class AdbrixremasterEvent {
  @Prop({ type: String })
  a_key: string;

  @Prop({ type: String })
  a_cookie: string;

  @Prop({ type: String })
  a_ip: string;

  @Prop({ type: String })
  a_fp: string;

  @Prop({ type: String })
  a_country: string;

  @Prop({ type: String })
  a_city: string;

  @Prop({ type: String })
  a_region: string;

  @Prop({ type: String })
  a_appkey: string;

  @Prop({ type: String })
  m_publisher: string;

  @Prop({ type: String })
  m_sub_publisher: string;

  @Prop({ type: String })
  attr_adid: string;

  @Prop({ type: Date })
  attr_event_datetime: Date;

  @Prop({ type: Number })
  attr_event_timestamp: number;

  @Prop({ type: Number })
  attr_seconds_gap: number;

  @Prop({ type: String })
  adid: string;

  @Prop({ type: String })
  idfv: string;

  @Prop({ type: Boolean, default: false })
  ad_id_opt_out: boolean;

  @Prop({ type: String })
  device_os_version: string;

  @Prop({ type: String })
  device_model: string;

  @Prop({ type: String })
  device_vendor: string;

  @Prop({ type: String })
  device_resolution: string;

  @Prop({ type: Boolean, default: false })
  device_portrait: boolean;

  @Prop({ type: String })
  device_platform: string;

  @Prop({ type: String })
  device_network: string;

  @Prop({ type: String })
  device_wifi: string;

  @Prop({ type: String })
  device_carrier: string;

  @Prop({ type: String })
  device_language: string;

  @Prop({ type: String })
  device_country: string;

  @Prop({ type: String })
  device_build_id: string;

  @Prop({ type: String })
  package_name: string;

  @Prop({ type: String })
  appkey: string;

  @Prop({ type: String })
  sdk_version: string;

  @Prop({ type: String })
  installer: string;

  @Prop({ type: String })
  app_version: string;

  @Prop({ type: String })
  event_name: string;

  @Prop({ type: Date })
  event_datetime: Date;

  @Prop({ type: Number })
  event_timestamp: number;

  @Prop({ type: Number })
  event_timestamp_d: number;

  @Prop({ type: String })
  param_json: string;

  @Prop({ type: String })
  cb_1: string;

  @Prop({ type: String })
  cb_2: string;

  @Prop({ type: String })
  cb_3: string;

  @Prop({ type: String })
  cb_4: string;

  @Prop({ type: String })
  cb_5: string;

  @Prop({ type: Date, default: Date.now(), expires: '180d' })
  createdAt: Date;
}

export const AdbrixremasterEventSchema = SchemaFactory.createForClass(AdbrixremasterEvent);
