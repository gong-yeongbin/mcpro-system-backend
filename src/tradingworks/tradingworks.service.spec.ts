import { Test, TestingModule } from '@nestjs/testing';
import { TradingworksService } from './tradingworks.service';

describe('TradingworksService', () => {
  let service: TradingworksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradingworksService],
    }).compile();

    service = module.get<TradingworksService>(TradingworksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
