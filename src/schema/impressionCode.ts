import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ImpressionCodeDocument = ImpressionCode & Document;

@Schema({ versionKey: false, collection: 'impressionCode', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class ImpressionCode {
  @Prop({ type: String, required: true, unique: true })
  impressionCode: string;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String, required: true })
  pub_id: string;

  @Prop({ type: String, required: true })
  sub_id: string;
}

export const ImpressionCodeSchema = SchemaFactory.createForClass(ImpressionCode);
ImpressionCodeSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 3 });
