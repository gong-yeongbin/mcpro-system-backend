import { Test, TestingModule } from '@nestjs/testing';
import { AdbrixremasterController } from './adbrixremaster.controller';

describe('AdbrixremasterController', () => {
  let controller: AdbrixremasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdbrixremasterController],
    }).compile();

    controller = module.get<AdbrixremasterController>(AdbrixremasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
