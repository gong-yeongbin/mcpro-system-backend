import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type ImpressionCodeDocument = ImpressionCode & Document;

@Schema({ versionKey: false, collection: 'impression-code' })
export class ImpressionCode {}

export const ImpressionCodeSchema = SchemaFactory.createForClass(ImpressionCode);
