import { Test, TestingModule } from '@nestjs/testing';
import { PostbackService } from './postback.service';

describe('PostbackService', () => {
  let service: PostbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostbackService],
    }).compile();

    service = module.get<PostbackService>(PostbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
