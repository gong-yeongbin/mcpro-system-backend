import { Column, CreateDateColumn } from 'typeorm';

export default class Postback {
  @Column({ type: 'string', name: 'token' })
  token: string;

  @Column({ type: 'string', name: 'carrier', nullable: true })
  carrier: string;

  @Column({ type: 'string', name: 'country', nullable: true })
  country: string;

  @Column({ type: 'string', name: 'language', nullable: true })
  language: string;

  @Column({ type: 'string', name: 'ip', nullable: true })
  ip: string;

  @Column({ type: 'string', name: 'adid', nullable: true })
  adid: string;

  @Column({ type: 'string', name: 'click_id', nullable: true })
  click_id: string;

  @Column({ type: 'string', name: 'impressionCode' })
  impressionCode: string;

  @Column({ type: 'string', name: 'event_name', nullable: true })
  event_name: string;

  @Column({ type: 'timestamp', name: 'click_time', nullable: true })
  click_time: Date;

  @Column({ type: 'timestamp', name: 'install_time', nullable: true })
  install_time: Date;

  @Column({ type: 'timestamp', name: 'event_time', nullable: true })
  event_time: Date;

  @Column({ type: 'string', name: 'revenue', default: 0 })
  revenue: number;

  @Column({ type: 'string', name: 'currency', nullable: true })
  currency: string;

  @Column({ type: 'string', name: 'send_time', nullable: true })
  send_time: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
