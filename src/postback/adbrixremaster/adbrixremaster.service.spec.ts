import { Test, TestingModule } from '@nestjs/testing';
import { AdbrixremasterService } from './adbrixremaster.service';

describe('AdbrixremasterService', () => {
  let service: AdbrixremasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdbrixremasterService],
    }).compile();

    service = module.get<AdbrixremasterService>(AdbrixremasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
