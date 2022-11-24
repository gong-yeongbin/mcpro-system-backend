import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IveInstallDocument = IveInstall & Document;

@Schema({ versionKey: false, collection: 'ive_install', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class IveInstall {
  @Prop({ type: String })
  p_clk: string;

  @Prop({ type: String })
  pub: string;

  @Prop({ type: String })
  sub_pub: string;

  @Prop({ type: String })
  ao: string;

  @Prop({ type: Number })
  click_time: number;

  @Prop({ type: Number })
  click_ts: number;

  @Prop({ type: Number })
  install_time: number;

  @Prop({ type: Number })
  install_ts: number;

  @Prop({ type: String })
  sub_param1: string;

  @Prop({ type: String })
  sub_param2: string;

  @Prop({ type: String })
  sub_param3: string;

  @Prop({ type: String })
  sub_param4: string;

  @Prop({ type: String })
  sub_param5: string;

  @Prop({ type: String })
  adid: string;

  @Prop({ type: String })
  idfa: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  os: string;

  @Prop({ type: String })
  os_ver: string;

  @Prop({ type: String })
  carrier: string;

  @Prop({ type: String })
  brand: string;

  @Prop({ type: String })
  model: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  language: string;
}

export const IveInstallSchema = SchemaFactory.createForClass(IveInstall);
IveInstallSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
