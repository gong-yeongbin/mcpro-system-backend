import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostBackEvent } from 'src/entities/PostBackEvent';
import { PostBackEventAppsflyer } from 'src/entities/PostBackEventAppsflyer';
import { PostBackInstallAppsflyer } from 'src/entities/PostBackInstallAppsflyer';
import { PostBackUnregisteredEvent } from 'src/entities/PostBackUnregisteredEvent';
import { SubMedia } from 'src/entities/SubMedia';
import { PostbackController } from './postback.controller';
import { PostbackService } from './postback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubMedia,
      PostBackEvent,
      PostBackUnregisteredEvent,
      PostBackEventAppsflyer,
      PostBackInstallAppsflyer,
    ]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [PostbackController],
  providers: [PostbackService],
})
export class PostbackModule {}
