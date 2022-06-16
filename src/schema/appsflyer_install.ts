import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AppsflyerInstallDocument = AppsflyerInstall & Document;

@Schema({ versionKey: false, collection: 'appsflyer_install' })
export class AppsflyerInstall {
  @Prop({ type: String })
  clickid: string;

  @Prop({ type: String })
  af_siteid: string;

  @Prop({ type: String })
  af_c_id: string;

  @Prop({ type: String })
  advertising_id: string;

  @Prop({ type: String })
  idfa: string;

  @Prop({ type: String })
  idfv: string;

  @Prop({ type: Date })
  install_time: Date;

  @Prop({ type: String })
  country_code: string;

  @Prop({ type: String })
  language: string;

  @Prop({ type: Date })
  click_time: Date;

  @Prop({ type: String })
  device_carrier: string;

  @Prop({ type: String })
  device_ip: string;

  @Prop({ type: Date, default: Date.now(), expires: '180d' })
  createdAt: Date;
}

export const AppsflyerInstallSchema = SchemaFactory.createForClass(AppsflyerInstall);
