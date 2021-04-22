// import {
//   Column,
//   Entity,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('tracking')
// export class Tracking {
//   @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
//   id: number;

//   @Column({ type: 'nvarchar', name: 'type', length: 30 })
//   type: string;

//   @Column({ type: 'nvarchar', name: 'advertisingCode', length: 30 })
//   advertisingCode: string;

//   @Column({ type: 'nvarchar', name: 'campaignCode', length: 30 })
//   campaignCode: string;

//   @Column({ type: 'nvarchar', name: 'mediaCode', length: 30 })
//   mediaCode: string;

//   @Column({ type: 'nvarchar', name: 'trackerCode', length: 30 })
//   trackerCode: string;

//   @Column({ type: 'nvarchar', name: 'trackingUrl', length: 500 })
//   trackingUrl: string;

//   @CreateDateColumn({ name: 'createdAt' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updatedAt' })
//   updatedAt: Date;
// }
