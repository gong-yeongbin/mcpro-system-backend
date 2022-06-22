import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Daily } from './daily';

export type PostbackDocument = Postback & Document;

@Schema({ versionKey: false, collection: 'postback', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Postback {
  @Prop({ type: String })
  token: string;

  @Prop({ type: String })
  carrier: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  language: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  adid: string;

  @Prop({ type: String })
  click_id: string;

  @Prop({ type: String })
  impressionCode: string;

  @Prop({ type: String })
  event_name: string;

  @Prop({ type: Date })
  click_time: Date;

  @Prop({ type: Date })
  install_time: Date;

  @Prop({ type: Date })
  event_time: Date;

  @Prop({ type: Number })
  revenue: number;

  @Prop({ type: String })
  currency: string;

  @Prop({ type: Date })
  send_time: Date;

  @Prop({ type: String })
  original_url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'daily' })
  daily: Daily;
}

export const PostbackSchema = SchemaFactory.createForClass(Postback);
PostbackSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
