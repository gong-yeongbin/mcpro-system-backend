import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DailyDocument = Daily & Document;

@Schema({ versionKey: false, collection: 'daily', timestamps: { createdAt: false, updatedAt: 'updatedAt' } })
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

  @Prop({ type: Date, default: Date.now(), expires: '365d' })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now() })
  updatedAt: Date;
}

export const DailySchema = SchemaFactory.createForClass(Daily);
