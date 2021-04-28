import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignDaily } from 'src/entities/CampaignDaily';
import { PostBackLog } from 'src/entities/PostBackLog';
import { SubMedia } from 'src/entities/SubMedia';
import { PostbackController } from './postback.controller';
import { PostbackService } from './postback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubMedia, PostBackLog, CampaignDaily]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [PostbackController],
  providers: [PostbackService],
})
export class PostbackModule {}
