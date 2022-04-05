import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema()
export class Config {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Boolean, default: false })
  status: boolean;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
