import { Test, TestingModule } from '@nestjs/testing';
import { SingularController } from './singular.controller';

describe('SingularController', () => {
  let controller: SingularController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SingularController],
    }).compile();

    controller = module.get<SingularController>(SingularController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
