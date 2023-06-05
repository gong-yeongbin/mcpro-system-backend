import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrackingLogDocument = TrackingLog & Document;

@Schema({ versionKey: false, collection: 'tracking_log' })
export class TrackingLog {
  @Prop({ type: String })
  token: string;

  @Prop({ type: String })
  click_id: string;

  @Prop({ type: String })
  pub_id: string;

  @Prop({ type: String })
  sub_id: string;

  @Prop({ type: String })
  adid: string;

  @Prop({ type: String })
  idfa: string;

  @Prop({ type: String })
  url: string;

  @Prop({ type: String })
  createdAt: string;
}

export const TrackingLogSchema = SchemaFactory.createForClass(TrackingLog);
// TrackingLogSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 1 });
