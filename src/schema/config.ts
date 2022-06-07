import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConfigDocument = Config & Document;

@Schema({ versionKey: false, collection: 'config' })
export class Config {
  @Prop({ types: String, require: true, default: 'trackingInfo' })
  name: string;

  @Prop({ types: Boolean, default: false })
  status: boolean;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
