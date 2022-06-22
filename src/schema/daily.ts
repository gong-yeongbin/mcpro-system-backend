import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DailyDocument = Daily & Document;

@Schema({ versionKey: false, collection: 'daily', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Daily {
  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, default: '' })
  pub_id: string;

  @Prop({ type: String, default: '' })
  sub_id: string;

  @Prop({ type: String, required: true })
  impressionCode: string;

  @Prop({ type: Number, default: 0 })
  click: number;

  @Prop({ type: Number, default: 0 })
  install: number;

  @Prop({ type: Number, default: 0 })
  registration: number;

  @Prop({ type: Number, default: 0 })
  retention: number;

  @Prop({ type: Number, default: 0 })
  purchase: number;

  @Prop({ type: Number, default: 0 })
  revenue: number;

  @Prop({ type: Number, default: 0 })
  etc1: number;

  @Prop({ type: Number, default: 0 })
  etc2: number;

  @Prop({ type: Number, default: 0 })
  etc3: number;

  @Prop({ type: Number, default: 0 })
  etc4: number;

  @Prop({ type: Number, default: 0 })
  etc5: number;

  @Prop({ type: Number, default: 0 })
  unregistered: number;
}

export const DailySchema = SchemaFactory.createForClass(Daily);
DailySchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
DailySchema.index({ createdAt: -1, impressionCode: 1 });
