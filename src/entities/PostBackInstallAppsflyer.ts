import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export interface PostBackInstallAppsflyerMetaData {
  clickid: string;
  af_siteid: string;
  af_c_id: string;
  advertising_id: string;
  idfa: string;
  idfv: string;
  install_time: string;
  country_code: string;
  language: string;
  click_time: string;
  device_carrier: string;
  device_ip: string;
  originalUrl: string;
  isSendDate?: Date;
}

@Entity('postback_install_appsflyer')
export class PostBackInstallAppsflyer {
  @PrimaryGeneratedColumn({ name: 'idx', type: 'bigint' })
  idx: number;

  @Column({ name: 'clickid', type: 'nvarchar' })
  clickid: string;

  @Column({ name: 'af_siteid', type: 'nvarchar' })
  af_siteid: string;

  @Column({ name: 'af_c_id', type: 'nvarchar' })
  af_c_id: string;

  @Column({ name: 'advertising_id', type: 'nvarchar', nullable: true })
  advertising_id: string;

  @Column({ name: 'idfa', type: 'nvarchar', nullable: true })
  idfa: string;

  @Column({ name: 'idfv', type: 'nvarchar', nullable: true })
  idfv: string;

  @Column({ name: 'install_time', type: 'nvarchar', nullable: true })
  install_time: string;

  @Column({ name: 'country_code', type: 'nvarchar', nullable: true })
  country_code: string;

  @Column({ name: 'language', type: 'nvarchar', nullable: true })
  language: string;

  @Column({ name: 'click_time', type: 'nvarchar', nullable: true })
  click_time: string;

  @Column({ name: 'device_carrier', type: 'nvarchar', nullable: true })
  device_carrier: string;

  @Column({ name: 'device_ip', type: 'nvarchar', nullable: true })
  device_ip: string;

  @Column({ name: 'originalUrl', type: 'text', nullable: true })
  originalUrl: string;

  @Column({ name: 'isSendDate', type: 'timestamp', nullable: true })
  isSendDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
