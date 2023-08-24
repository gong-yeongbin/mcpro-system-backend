import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NswitchEventDocument = NswitchEvent & Document;

@Schema({ versionKey: false, collection: 'nswitch_event', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class NswitchEvent {
  @Prop({ type: String })
  nsw_click_time: string;

  @Prop({ type: String })
  nsw_conv_time: string;

  @Prop({ type: String })
  nsw_country_code: string;

  @Prop({ type: String })
  nsw_google_aid: string;

  @Prop({ type: String })
  nsw_idfa: string;

  @Prop({ type: String })
  nsw_gpr_click_time: string;

  @Prop({ type: String })
  nsw_gpr_install_time: string;

  @Prop({ type: String })
  nsw_installer: string;

  @Prop({ type: String })
  nsw_ip: string;

  @Prop({ type: String })
  nsw_lang: string;

  @Prop({ type: String })
  nsw_match_type: string;

  @Prop({ type: String })
  nsw_model: string;

  @Prop({ type: String })
  nsw_net: string;

  @Prop({ type: String })
  nsw_net_op: string;

  @Prop({ type: String })
  nsw_os_ver: string;

  @Prop({ type: String })
  nsw_tsdk_ver: string;

  @Prop({ type: String })
  nsw_sub_media_id: string;

  @Prop({ type: String })
  nsw_event_id: string;

  @Prop({ type: String })
  nsw_event_price: string;

  @Prop({ type: String })
  nsw_event_time: string;

  @Prop({ type: String })
  custom1: string;

  @Prop({ type: String })
  custom2: string;

  @Prop({ type: String })
  custom3: string;
}

export const NswitchEventSchema = SchemaFactory.createForClass(NswitchEvent);
NswitchEventSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
