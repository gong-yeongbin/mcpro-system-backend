import { Test, TestingModule } from '@nestjs/testing';
import { TradingworksController } from './tradingworks.controller';

describe('TradingworksController', () => {
  let controller: TradingworksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradingworksController],
    }).compile();

    controller = module.get<TradingworksController>(TradingworksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
