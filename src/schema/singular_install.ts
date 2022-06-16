import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SingularInstallDocument = SingularInstall & Document;

@Schema({ versionKey: false, collection: 'singular_install' })
export class SingularInstall {
  @Prop({ type: String })
  attribution_ip: string;

  @Prop({ type: String })
  os_version: string;

  @Prop({ type: String })
  app_version: string;

  @Prop({ type: String })
  idfa: string;

  @Prop({ type: String })
  idfv: string;

  @Prop({ type: String })
  gaid: string;

  @Prop({ type: String })
  attribution_country: string;

  @Prop({ type: String })
  platform: string;

  @Prop({ type: String })
  time: String;

  @Prop({ type: Number })
  utc: number;

  @Prop({ type: String })
  click_time: String;

  @Prop({ type: Number })
  click_utc: number;

  @Prop({ type: String })
  sub1: string;

  @Prop({ type: String })
  sub2: string;

  @Prop({ type: String })
  sub3: string;

  @Prop({ type: String })
  sub4: string;

  @Prop({ type: String })
  sub5: string;

  @Prop({ type: Date, default: Date.now(), expires: 60 * 60 * 24 * 30 * 6 })
  createdAt: Date;
}

export const SingularInstallSchema = SchemaFactory.createForClass(SingularInstall);
