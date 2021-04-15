import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "submedia_AD000007_campaignCode_submediaCode_registeredAt",
  ["campaignCode", "submediaCode", "registeredAt"],
  { unique: true }
)
@Index("trackerCode", ["trackerCode"], {})
@Index("mediaCode", ["mediaCode"], {})
@Index("advertisingCode", ["advertisingCode"], {})
@Index("campaignCode", ["campaignCode"], {})
@Index("campaignToken", ["campaignToken"], {})
@Index("submediaCode", ["submediaCode"], {})
@Index("viewCode", ["viewCode"], {})
@Index("registeredAt", ["registeredAt"], {})
@Entity("x_daily_campaign_submedia_AD000007", { schema: "mecrosspro" })
export class XDailyCampaignSubmediaAd000007 {
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

  @Column("int", { name: "click", nullable: true, default: () => "'0'" })
  public click: number | null;

  @Column("int", { name: "install", nullable: true, default: () => "'0'" })
  public install: number | null;

  @Column("int", { name: "signup", nullable: true, default: () => "'0'" })
  public signup: number | null;

  @Column("int", { name: "retention", nullable: true, default: () => "'0'" })
  public retention: number | null;

  @Column("int", { name: "buy", nullable: true, default: () => "'0'" })
  public buy: number | null;

  @Column("int", { name: "price", nullable: true, default: () => "'0'" })
  public price: number | null;

  @Column("int", { name: "etc1", nullable: true, default: () => "'0'" })
  public etc1: number | null;

  @Column("int", { name: "etc2", nullable: true, default: () => "'0'" })
  public etc2: number | null;

  @Column("int", { name: "etc3", nullable: true, default: () => "'0'" })
  public etc3: number | null;

  @Column("int", { name: "etc4", nullable: true, default: () => "'0'" })
  public etc4: number | null;

  @Column("int", { name: "etc5", nullable: true, default: () => "'0'" })
  public etc5: number | null;

  @Column("datetime", { name: "registeredAt", nullable: true })
  public registeredAt: Date | null;

  @Column("datetime", { name: "createdAt" })
  public createdAt: Date;

  @Column("datetime", { name: "updatedAt" })
  public updatedAt: Date;
}
