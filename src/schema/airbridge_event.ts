import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AirbridgeEventDocument = AirbridgeEvent & Document;

@Schema({ versionKey: false, collection: 'airbridge_event' })
export class AirbridgeEvent {
  @Prop({ type: String })
  click_id: string;

  @Prop({ type: String })
  sub_id: string;

  @Prop({ type: String })
  uuid: string;

  @Prop({ type: String })
  google_aid: string;

  @Prop({ type: String })
  ios_idfa: string;

  @Prop({ type: String })
  ios_ifv: string;

  @Prop({ type: Boolean, default: false })
  limitAdTracking: boolean;

  @Prop({ type: String })
  device_model: string;

  @Prop({ type: String })
  device_manufacturer: string;

  @Prop({ type: String })
  os: string;

  @Prop({ type: String })
  os_version: string;

  @Prop({ type: String })
  locale: string;

  @Prop({ type: String })
  language: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  device_carrier: string;

  @Prop({ type: String })
  timezone: string;

  @Prop({ type: String })
  device_ip: string;

  @Prop({ type: String })
  packageName: string;

  @Prop({ type: String })
  iTunesAppID: string;

  @Prop({ type: String })
  appVersion: string;

  @Prop({ type: String })
  appName: string;

  @Prop({ type: String })
  sdkVersion: string;

  @Prop({ type: String })
  event_type: string;

  @Prop({ type: Boolean, default: false })
  isUnique: boolean;

  @Prop({ type: Date })
  event_datetime: Date;

  @Prop({ type: Number })
  event_timestamp: number;

  @Prop({ type: Number })
  install_timestamp: number;

  @Prop({ type: Date })
  click_datetime: Date;

  @Prop({ type: Number })
  click_timestamp: number;

  @Prop({ type: String })
  deeplink: string;

  @Prop({ type: String })
  googleReferrer: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: String })
  eventName: string;

  @Prop({ type: String })
  eventLabel: string;

  @Prop({ type: String })
  eventValue: string;

  @Prop({ type: Boolean, default: false })
  inAppPurchased: boolean;

  @Prop({ type: String })
  transactionID: string;

  @Prop({ type: String })
  product_info: string;

  @Prop({ type: String })
  attributedChannel: string;

  @Prop({ type: String })
  campaign: string;

  @Prop({ type: String })
  ad_type: string;

  @Prop({ type: String })
  ad_group: string;

  @Prop({ type: String })
  ad_creative: string;

  @Prop({ type: String })
  attributedMatchingType: string;

  @Prop({ type: String })
  custom_param1: string;

  @Prop({ type: String })
  custom_param2: string;

  @Prop({ type: String })
  custom_param3: string;

  @Prop({ type: String })
  custom_param4: string;

  @Prop({ type: String })
  custom_param5: string;

  @Prop({ type: Date, default: Date.now, expires: '90d' })
  createdAt: Date;
}

export const AirbridgeEventSchema = SchemaFactory.createForClass(AirbridgeEvent);
