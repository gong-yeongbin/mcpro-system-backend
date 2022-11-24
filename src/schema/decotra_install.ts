import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DecotraInstallDocument = DecotraInstall & Document;

@Schema({ versionKey: false, collection: 'decotra_install', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class DecotraInstall {
  //click_id
  @Prop({ type: String })
  sub1: string;

  //publisher_id
  @Prop({ type: String })
  sub2: string;

  //token
  @Prop({ type: String })
  sub5: string;

  //idfa
  @Prop({ type: String })
  sub7: string;

  //gaid
  @Prop({ type: String })
  sub8: string;

  @Prop({ type: String })
  country_code: string;

  @Prop({ type: String })
  device_brand: string;

  @Prop({ type: String })
  device_carrier: string;

  @Prop({ type: String })
  device_ip: string;

  @Prop({ type: String })
  device_model: string;

  @Prop({ type: String })
  device_type: string;
}

export const DecotraInstallSchema = SchemaFactory.createForClass(DecotraInstall);
DecotraInstallSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
