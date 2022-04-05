import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TrackingInfoDocument = TrackingInfo & Document;

@Schema()
export class TrackingInfo {
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String })
  clickId: string;

  @Prop({ type: String })
  pubId: string;

  @Prop({ type: String })
  subId: string;

  @Prop({ type: String })
  adid: string;

  @Prop({ type: String })
  idfa: string;

  @Prop({ type: Date, default: Date.now })
  regDt: Date;
}

export const TrackingInfoSchema = SchemaFactory.createForClass(TrackingInfo);
