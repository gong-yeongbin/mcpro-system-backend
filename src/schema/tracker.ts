import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrackerDocument = Tracker & Document;

@Schema({ versionKey: false, collection: 'tracker', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Tracker {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  trackingUrl: string;

  @Prop({ type: String, required: true })
  installUrl: string;

  @Prop({ type: String, required: true })
  eventUrl: string;
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker);
