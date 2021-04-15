import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "x_postback__a_d000009_campaign_code_registered_at_event_name",
  ["campaignCode", "registeredAt", "eventName"],
  {}
)
@Entity("x_postback_AD000009", { schema: "mecrosspro" })
export class XPostbackAd000009 {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  public id: string;

  @Column("varchar", { name: "trackerCode", nullable: true, length: 30 })
  public trackerCode: string | null;

  @Column("varchar", { name: "mediaCode", nullable: true, length: 30 })
  public mediaCode: string | null;

  @Column("varchar", { name: "advertisingCode", nullable: true, length: 30 })
  public advertisingCode: string | null;

  @Column("varchar", { name: "campaignCode", nullable: true, length: 30 })
  public campaignCode: string | null;

  @Column("varchar", { name: "campaignToken", nullable: true, length: 30 })
  public campaignToken: string | null;

  @Column("varchar", { name: "viewCode", nullable: true, length: 30 })
  public viewCode: string | null;

  @Column("varchar", { name: "submediaCode", nullable: true, length: 500 })
  public submediaCode: string | null;

  @Column("varchar", { name: "type", nullable: true, length: 30 })
  public type: string | null;

  @Column("varchar", { name: "platform", nullable: true, length: 300 })
  public platform: string | null;

  @Column("varchar", { name: "appkey", nullable: true, length: 300 })
  public appkey: string | null;

  @Column("varchar", { name: "deviceCountry", nullable: true, length: 30 })
  public deviceCountry: string | null;

  @Column("varchar", { name: "deviceLanguage", nullable: true, length: 30 })
  public deviceLanguage: string | null;

  @Column("varchar", { name: "deviceCarrier", nullable: true, length: 30 })
  public deviceCarrier: string | null;

  @Column("varchar", { name: "deviceIp", nullable: true, length: 30 })
  public deviceIp: string | null;

  @Column("varchar", { name: "userAgent", nullable: true, length: 300 })
  public userAgent: string | null;

  @Column("varchar", { name: "deviceId", nullable: true, length: 100 })
  public deviceId: string | null;

  @Column("varchar", { name: "deviceAndroidId", nullable: true, length: 100 })
  public deviceAndroidId: string | null;

  @Column("varchar", { name: "deviceIosId", nullable: true, length: 100 })
  public deviceIosId: string | null;

  @Column("varchar", { name: "clickId", nullable: true, length: 300 })
  public clickId: string | null;

  @Column("datetime", { name: "clickDatetime", nullable: true })
  public clickDatetime: Date | null;

  @Column("datetime", { name: "installDatetime", nullable: true })
  public installDatetime: Date | null;

  @Column("datetime", { name: "eventDatetime", nullable: true })
  public eventDatetime: Date | null;

  @Column("datetime", { name: "mediaSendDatetime", nullable: true })
  public mediaSendDatetime: Date | null;

  @Column("varchar", { name: "eventName", nullable: true, length: 100 })
  public eventName: string | null;

  @Column("varchar", { name: "mediaSendUrl", nullable: true, length: 1000 })
  public mediaSendUrl: string | null;

  @Column("varchar", { name: "product", nullable: true, length: 1000 })
  public product: string | null;

  @Column("varchar", { name: "productId", nullable: true, length: 100 })
  public productId: string | null;

  @Column("int", { name: "price", nullable: true, default: () => "'0'" })
  public price: number | null;

  @Column("varchar", { name: "currency", nullable: true, length: 100 })
  public currency: string | null;

  @Column("varchar", { name: "firstPurchase", nullable: true, length: 100 })
  public firstPurchase: string | null;

  @Column("text", { name: "originalUrl", nullable: true })
  public originalUrl: string | null;

  @Column("datetime", { name: "registeredAt", nullable: true })
  public registeredAt: Date | null;

  @Column("datetime", { name: "createdAt" })
  public createdAt: Date;

  @Column("datetime", { name: "updatedAt" })
  public updatedAt: Date;
}
