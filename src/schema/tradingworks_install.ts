import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TradingworksInstallDocument = TradingworksInstall & Document;

@Schema({ versionKey: false, collection: 'tradingworks_install', timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class TradingworksInstall {
  @Prop({ type: String })
  transaction_id: string;

  @Prop({ type: String })
  publisher_id: string;

  @Prop({ type: String })
  adid: string;

  @Prop({ type: String })
  idfa: string;

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

  @Prop({ type: String })
  cb_param1: string;

  @Prop({ type: String })
  cb_param2: string;
}

export const TradingworksInstallSchema = SchemaFactory.createForClass(TradingworksInstall);
TradingworksInstallSchema.index({ createdAt: 1 }, { expires: 60 * 60 * 24 * 30 * 12 });
