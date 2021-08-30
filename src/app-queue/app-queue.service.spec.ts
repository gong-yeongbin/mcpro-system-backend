import { Test, TestingModule } from '@nestjs/testing';
import { AppQueueService } from './app-queue.service';

describe('AppQueueService', () => {
  let service: AppQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppQueueService],
    }).compile();

    service = module.get<AppQueueService>(AppQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
