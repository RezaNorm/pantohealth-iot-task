import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';

describe('ConsumerController', () => {
  let controller: ConsumerController;
  let consumerService: jest.Mocked<ConsumerService>;

  beforeEach(async () => {
    const mockConsumerService = {
      getProcessingStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerController],
      providers: [
        {
          provide: ConsumerService,
          useValue: mockConsumerService,
        },
      ],
    }).compile();

    controller = module.get<ConsumerController>(ConsumerController);
    consumerService = module.get(ConsumerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return service name', () => {
      const result = controller.getHello();
      expect(result).toBe('X-Ray IoT Consumer Service');
    });
  });

  describe('getProcessingStats', () => {
    it('should return processing statistics', async () => {
      const mockStats = {
        message: 'Consumer processing statistics',
        stats: {
          totalSignals: 3,
          avgDataLength: 34.33,
          avgDataVolume: 2708.67,
          totalDataVolume: 8126,
        },
        timestamp: '2025-08-28T12:50:42.584Z',
      };

      consumerService.getProcessingStats.mockResolvedValue(mockStats);

      const result = await controller.getProcessingStats();

      expect(consumerService.getProcessingStats).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });

    it('should handle errors when getting statistics', async () => {
      consumerService.getProcessingStats.mockRejectedValue(new Error('Stats error'));

      await expect(controller.getProcessingStats()).rejects.toThrow('Stats error');
    });
  });
});