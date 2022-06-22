import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrackingInfoDocument = TrackingInfo & Document;

@Schema({ versionKey: false, collection: 'trackingInfo', timestamps: { createdAt: 'createdAt', updatedAt: false } })
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
}

export const TrackingInfoSchema = SchemaFactory.createForClass(TrackingInfo);
TrackingInfoSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 10 });
