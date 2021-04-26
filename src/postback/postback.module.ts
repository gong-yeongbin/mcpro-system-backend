import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/entities/Campaign';
import { SubMedia } from 'src/entities/SubMedia';
import { PostbackController } from './postback.controller';
import { PostbackService } from './postback.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubMedia, Campaign])],
  controllers: [PostbackController],
  providers: [PostbackService],
})
export class PostbackModule {}
