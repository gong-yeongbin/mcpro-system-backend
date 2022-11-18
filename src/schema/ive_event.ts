import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IveEventDocument = IveEvent & Document;

@Schema({ versionKey: false, collection: 'ive_event', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class IveEvent {
  @Prop({ type: String })
  p_clk: string;

  @Prop({ type: String })
  pub: string;

  @Prop({ type: String })
  sub_pub: string;

  @Prop({ type: String })
  event_name: string;

  @Prop({ type: String })
  event_value: string;

  @Prop({ type: Date })
  event_time: Date;

  @Prop({ type: Number })
  event_ts: number;

  @Prop({ type: String })
  sub_param1: string;

  @Prop({ type: String })
  sub_param2: string;

  @Prop({ type: String })
  sub_param3: string;

  @Prop({ type: String })
  sub_param4: string;

  @Prop({ type: String })
  sub_param5: string;

  @Prop({ type: String })
  adid: string;

  @Prop({ type: String })
  idfa: string;

  @Prop({ type: String })
  platform: string;

  @Prop({ type: String })
  os_ver: string;

  @Prop({ type: String })
  carrier: string;

  @Prop({ type: String })
  brand: string;

  @Prop({ type: String })
  model: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  language: string;

  @Prop({ type: String })
  ip: string;
}

export const IveEventSchema = SchemaFactory.createForClass(IveEvent);
IveEventSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
