import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrackingLogDocument = TrackingLog & Document;

@Schema({ versionKey: false, collection: 'tracking_log' })
export class TrackingLog {
  @Prop({ type: String })
  token: string;

  @Prop({ type: String, unique: true })
  adid: string;

  @Prop({ type: String })
  idfa: string;
}

export const TrackingLogSchema = SchemaFactory.createForClass(TrackingLog);
// , { expires: 60 * 60 * 24 * 1 }
