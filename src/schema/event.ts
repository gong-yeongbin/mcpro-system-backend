import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Campaign } from './campaign';

export type EventDocument = Event & Document;

@Schema({ versionKey: false, collection: 'event', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Event {
  @Prop({ type: String, required: true, default: 'install' })
  tracker: string;

  @Prop({ type: String, required: true, default: 'install' })
  admin: string;

  @Prop({ type: String, required: true, default: 'install' })
  media: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: String, required: true })
  token: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
