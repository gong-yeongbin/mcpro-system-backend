import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SingularEventDocument = SingularEvent & Document;

@Schema({ versionKey: false, collection: 'singular_event' })
export class SingularEvent {
  @Prop({ type: String })
  attribution_ip: string;

  @Prop({ type: String })
  os_version: string;

  @Prop({ type: String })
  app_version: string;

  @Prop({ type: String })
  idfa: string;

  @Prop({ type: String })
  idfv: string;

  @Prop({ type: String })
  gaid: string;

  @Prop({ type: String })
  attribution_country: string;

  @Prop({ type: String })
  platform: string;

  @Prop({ type: Number, default: 0.0 })
  amount: number;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: String })
  event_name: string;

  @Prop({ type: String })
  event_attrs: string;

  @Prop({ type: String })
  time: String;

  @Prop({ type: Number })
  utc: number;

  @Prop({ type: String })
  click_time: String;

  @Prop({ type: Number })
  click_utc: number;

  @Prop({ type: String })
  sub1: string;

  @Prop({ type: String })
  sub2: string;

  @Prop({ type: String })
  sub3: string;

  @Prop({ type: String })
  sub4: string;

  @Prop({ type: String })
  sub5: string;

  @Prop({ type: Date, default: Date.now(), expires: '180d' })
  createdAt: Date;
}

export const SingularEventSchema = SchemaFactory.createForClass(SingularEvent);
