import { Test, TestingModule } from '@nestjs/testing';
import { SingularService } from './singular.service';

describe('SingularService', () => {
  let service: SingularService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SingularService],
    }).compile();

    service = module.get<SingularService>(SingularService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
