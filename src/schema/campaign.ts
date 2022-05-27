import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Advertising } from './advertising';
import { Media } from './media';

export type CampaignDocument = Campaign & Document;

@Schema({ versionKey: false, collection: 'campaign', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Campaign {
  @Prop({ type: String, require: true, trim: true, unique: true })
  token: string;

  @Prop({ type: String, require: true, trim: true })
  name: string;

  @Prop({ type: String, require: true, enum: ['CPI', 'CPA'] })
  type: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: String, require: true })
  trackerTrackingUrl: string;

  @Prop({ type: String, require: true })
  mecrossTrackingUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'advertising' })
  advertising: Advertising;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'media' })
  media: Media;
}
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
