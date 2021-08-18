import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign, PostBackEvent } from 'src/entities/Entity';
import { AppQueueService } from './app-queue.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, PostBackEvent]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  providers: [AppQueueService],
})
export class AppQueueModule {}
