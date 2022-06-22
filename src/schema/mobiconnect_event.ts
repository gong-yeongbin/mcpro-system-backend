import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MobiconnectEventDocument = MobiconnectEvent & Document;

@Schema({ versionKey: false, collection: 'mobiconnect_event', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class MobiconnectEvent {
  @Prop({ type: String })
  pub_id: string;

  @Prop({ type: String })
  sub_pub_id: string;

  @Prop({ type: String })
  click_id: string;

  @Prop({ type: String })
  gaid: string;

  @Prop({ type: String })
  idfa: string;

  @Prop({ type: String })
  android_id: string;

  @Prop({ type: String })
  os: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  carrier: string;

  @Prop({ type: String })
  country_code: string;

  @Prop({ type: String })
  language: string;

  @Prop({ type: Number })
  click_timestamp: number;

  @Prop({ type: Number })
  install_timestamp: number;

  @Prop({ type: Number })
  event_timestamp: number;

  @Prop({ type: String })
  event_id: string;

  @Prop({ type: Number })
  revenue: number;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: String })
  custom1: string;

  @Prop({ type: String })
  custom2: string;

  @Prop({ type: String })
  custom3: string;
}

export const MobiconnectEventSchema = SchemaFactory.createForClass(MobiconnectEvent);
MobiconnectEventSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
