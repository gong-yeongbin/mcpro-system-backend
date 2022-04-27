import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackingModule } from './tracking/tracking.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';
import { AppClusterService } from './app-cluster/app-cluster.service';
import { AppsflyerModule } from './appsflyer/appsflyer.module';
import { AdbrixremasterModule } from './adbrixremaster/adbrixremaster.module';
import { AdjustModule } from './adjust/adjust.module';
import { SingularModule } from './singular/singular.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DeveloperModule } from './developer/developer.module';
import { TradingworksModule } from './tradingworks/tradingworks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
      isGlobal: true,
    }),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: false,
      entities: [__dirname + '/**/*{.ts,.js}'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    TrackingModule,
    AppsflyerModule,
    AdbrixremasterModule,
    AdjustModule,
    SingularModule,
    TradingworksModule,
    DeveloperModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppClusterService],
  exports: [ConfigModule],
})
export class AppModule {}
