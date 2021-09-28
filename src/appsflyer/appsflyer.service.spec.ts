import { Test, TestingModule } from '@nestjs/testing';
import { AppsflyerService } from './appsflyer.service';

describe('AppsflyerService', () => {
  let service: AppsflyerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppsflyerService],
    }).compile();

    service = module.get<AppsflyerService>(AppsflyerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
