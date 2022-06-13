import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Campaign } from './campaign';

export type ImpressionCodeDocument = ImpressionCode & Document;

@Schema({ versionKey: false, collection: 'impressionCode' })
export class ImpressionCode {
  @Prop({ type: String, default: '' })
  pub_id: string;

  @Prop({ type: String, default: '' })
  sub_id: string;

  @Prop({ type: String, required: true })
  impressionCode: string;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: Date, default: Date.now(), expires: '30d' })
  updatedAt: Date;
}

export const ImpressionCodeSchema = SchemaFactory.createForClass(ImpressionCode);
