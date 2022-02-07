import { Module } from '@nestjs/common';
import { SingularController } from './singular.controller';
import { SingularService } from './singular.service';

@Module({
  controllers: [SingularController],
  providers: [SingularService]
})
export class SingularModule {}
