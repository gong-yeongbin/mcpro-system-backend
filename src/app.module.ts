import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackingModule } from './tracking/tracking.module';
import { PostbackModule } from './postback/postback.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';
const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
      isGlobal: true,
    }),
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    }),
    TypeOrmModule.forRoot({
      type: process.env.MYSQL_TYPE as 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: Boolean(process.env.MYSQL_SYNCHRONIZE),
      entities: [__dirname + '/**/*{.ts,.js}'],
    }),
    TrackingModule,
    PostbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {}
