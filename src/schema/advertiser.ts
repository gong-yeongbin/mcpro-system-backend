import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdvertiserDocument = Advertiser & Document;

@Schema({ versionKey: false, collection: 'advertiser', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Advertiser {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const AdvertiserSchema = SchemaFactory.createForClass(Advertiser);
