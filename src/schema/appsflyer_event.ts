import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AppsflyerEventDocument = AppsflyerEvent & Document;

@Schema({ versionKey: false, collection: 'appsflyer_event' })
export class AppsflyerEvent {
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

  @Prop({ type: String })
  event_name: string;

  @Prop({ type: String })
  event_revenue_currency: string;

  @Prop({ type: Number })
  event_revenue: number;

  @Prop({ type: Date })
  event_time: Date;

  @Prop({ type: String })
  device_carrier: string;

  @Prop({ type: String })
  device_ip: string;

  @Prop({ type: Date, default: Date.now(), expires: 60 * 60 * 24 * 30 * 6 })
  createdAt: Date;
}

export const AppsflyerEventSchema = SchemaFactory.createForClass(AppsflyerEvent);
