import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdjustEventDocument = AdjustEvent & Document;

@Schema({ versionKey: false, collection: 'adjust_event', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class AdjustEvent {
  @Prop({ type: String })
  event_token: string;

  @Prop({ type: String })
  event_type: string;

  @Prop({ type: String })
  cp_token: string;

  @Prop({ type: String })
  publisher_id: string;

  @Prop({ type: String })
  app_id: string;

  @Prop({ type: String })
  app_version: string;

  @Prop({ type: String })
  network_name: string;

  @Prop({ type: String })
  campaign_name: string;

  @Prop({ type: String })
  adgroup_name: string;

  @Prop({ type: String })
  adid: string;

  @Prop({ type: String })
  gps_adid: string;

  @Prop({ type: String })
  ip_address: string;

  @Prop({ type: Number })
  click_time: number;

  @Prop({ type: Number })
  engagement_time: number;

  @Prop({ type: Number })
  installed_at: number;

  @Prop({ type: Number })
  created_at: number;

  @Prop({ type: String })
  isp: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  language: string;

  @Prop({ type: String })
  device_name: string;

  @Prop({ type: String })
  device_type: string;

  @Prop({ type: String })
  os_name: string;

  @Prop({ type: String })
  sdk_version: string;

  @Prop({ type: String })
  os_version: string;
}

export const AdjustEventSchema = SchemaFactory.createForClass(AdjustEvent);
AdjustEventSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
