import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackingModule } from './tracking/tracking.module';
import { PostbackModule } from './postback/postback.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';
import { RedisLockModule } from 'nestjs-simple-redis-lock';
import { AppClusterService } from './app-cluster/app-cluster.service';
import { BullModule } from '@nestjs/bull';
import { AppQueueService } from './app-queue/app-queue.service';
import { CommonService } from './common/common.service';
import {
  Campaign,
  PostBackDaily,
  PostBackEvent,
  PostBackEventAdbrixremaster,
  PostBackInstallAdbrixremaster,
  PostBackUnregisteredEvent,
} from './entities/Entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
      },
    }),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
    RedisLockModule.register({}),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
    TypeOrmModule.forRoot({
      type: process.env.MYSQL_TYPE as 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: Boolean(process.env.MYSQL_SYNCHRONIZE),
      entities: [__dirname + '/**/*{.ts,.js}'],
      connectTimeout: 5000,
    }),
    TypeOrmModule.forFeature([
      Campaign,
      PostBackDaily,
      PostBackEvent,
      PostBackUnregisteredEvent,
      PostBackInstallAdbrixremaster,
      PostBackEventAdbrixremaster,
      PostBackDaily,
    ]),
    TrackingModule,
    PostbackModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppClusterService, AppQueueService, CommonService],
  exports: [ConfigModule],
})
export class AppModule {}
