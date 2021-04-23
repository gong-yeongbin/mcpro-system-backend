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

//   @Column({ type: 'nvarchar', name: 'type' })
//   type: string;

//   @Column({ type: 'nvarchar', name: 'advertisingCode' })
//   advertisingCode: string;

//   @Column({ type: 'nvarchar', name: 'campaignCode' })
//   campaignCode: string;

//   @Column({ type: 'nvarchar', name: 'mediaCode' })
//   mediaCode: string;

//   @Column({ type: 'nvarchar', name: 'trackerCode' })
//   trackerCode: string;

//   @Column({ type: 'nvarchar', name: 'trackingUrl' })
//   trackingUrl: string;

//   @CreateDateColumn({ name: 'createdAt' })
//   createdAt: Date;

//   @UpdateDateColumn({ name: 'updatedAt' })
//   updatedAt: Date;
// }
