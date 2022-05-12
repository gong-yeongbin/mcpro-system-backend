import { Test, TestingModule } from '@nestjs/testing';
import { PostbackController } from './postback.controller';

describe('PostbackController', () => {
  let controller: PostbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostbackController],
    }).compile();

    controller = module.get<PostbackController>(PostbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
