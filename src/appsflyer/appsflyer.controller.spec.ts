import { Test, TestingModule } from '@nestjs/testing';
import { AppsflyerController } from './appsflyer.controller';

describe('AppsflyerController', () => {
  let controller: AppsflyerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppsflyerController],
    }).compile();

    controller = module.get<AppsflyerController>(AppsflyerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
