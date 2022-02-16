import { PostbackEventSingular, PostbackInstallSingular } from '@entities/Entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingularController } from './singular.controller';
import { SingularService } from './singular.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostbackInstallSingular, PostbackEventSingular])],
  controllers: [SingularController],
  providers: [SingularService],
})
export class SingularModule {}
