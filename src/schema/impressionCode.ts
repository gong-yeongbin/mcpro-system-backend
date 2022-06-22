import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ImpressionCodeDocument = ImpressionCode & Document;

@Schema({ versionKey: false, collection: 'impressionCode', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class ImpressionCode {
  @Prop({ type: String, required: true, unique: true })
  impressionCode: string;

  @Prop({ type: String, required: true })
  token: string;

  @Prop({ type: String })
  pub_id: string;

  @Prop({ type: String })
  sub_id: string;
}

export const ImpressionCodeSchema = SchemaFactory.createForClass(ImpressionCode);
ImpressionCodeSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 10 });
ImpressionCodeSchema.index({ token: 1, pub_id: 1, sub_id: 1 });
