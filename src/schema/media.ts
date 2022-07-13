import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MediaDocument = Media & Document;

@Schema({ versionKey: false, collection: 'media', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class Media {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  installUrl: string;

  @Prop({ type: String, required: true, unique: true })
  eventUrl: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
