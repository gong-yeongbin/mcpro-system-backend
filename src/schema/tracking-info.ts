import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrackingInfoDocument = TrackingInfo & Document;

@Schema({ versionKey: false, collection: 'tracking-info' })
export class TrackingInfo {
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, default: '' })
  click_id: string;

  @Prop({ type: String, default: '' })
  pub_id: string;

  @Prop({ type: String, default: '' })
  sub_id: string;

  @Prop({ type: String, default: '' })
  idfa: string;

  @Prop({ type: String, default: '' })
  adid: string;

  @Prop({ type: Date, default: Date.now, expires: '5d' })
  createdAt: Date;
}

export const TrackingInfoSchema = SchemaFactory.createForClass(TrackingInfo);
