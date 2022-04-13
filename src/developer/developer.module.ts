import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from 'src/schema/Config';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from './developer.service';

@Module({
  // imports: [MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }])],
  controllers: [DeveloperController],
  providers: [DeveloperService],
})
export class DeveloperModule {}
