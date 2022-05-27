import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Campaign } from './campaign';

export type ReservationDocument = Reservation & Document;

@Schema({ versionKey: false, collection: 'reservation', timestamps: { createdAt: false, updatedAt: 'updatedAt' } })
export class Reservation {
  @Prop({ type: String, required: true })
  oldName: string;

  @Prop({ type: String, required: true })
  newName: string;

  @Prop({ type: String, required: true })
  oldUrl: string;

  @Prop({ type: String, required: true })
  newUrl: string;

  @Prop({ type: Boolean, default: false })
  status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'campaign' })
  campaign: Campaign;

  @Prop({ type: Date, required: true })
  reservedAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
