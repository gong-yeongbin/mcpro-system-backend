import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Advertiser } from './advertiser';
import { Tracker } from './tracker';

export type AdvertisingDocument = Advertising & Document;

@Schema({ versionKey: false, collection: 'advertising', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Advertising {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, enum: ['AOS', 'IOS'] })
  platform: string;

  @Prop({ type: String })
  imageUrl: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'tracker' })
  tracker: Tracker;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'advertiser' })
  advertiser: Advertiser;
}

export const AdvertisingSchema = SchemaFactory.createForClass(Advertising);
