import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let appService: jest.Mocked<AppService>;

  beforeEach(async () => {
    const mockAppService = {
      simulateXRayData: jest.fn(),
      startSimulation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should return service name', () => {
      const result = controller.getHello();
      expect(result).toBe('X-Ray IoT Producer Service');
    });
  });

  describe('simulateXRayData', () => {
    it('should simulate x-ray data and return success message', async () => {
      appService.simulateXRayData.mockResolvedValue(undefined);

      const result = await controller.simulateXRayData();

      expect(appService.simulateXRayData).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'X-ray data simulation completed',
      });
    });

    it('should handle simulation errors', async () => {
      appService.simulateXRayData.mockRejectedValue(new Error('Simulation failed'));

      await expect(controller.simulateXRayData()).rejects.toThrow('Simulation failed');
    });
  });

  describe('startSimulation', () => {
    it('should start simulation with default interval', async () => {
      appService.startSimulation.mockResolvedValue(undefined);

      const result = await controller.startSimulation({});

      expect(appService.startSimulation).toHaveBeenCalledWith(5000);
      expect(result).toEqual({
        message: 'X-ray data simulation started with 5000ms interval',
      });
    });

    it('should start simulation with custom interval', async () => {
      appService.startSimulation.mockResolvedValue(undefined);

      const result = await controller.startSimulation({ intervalMs: 10000 });

      expect(appService.startSimulation).toHaveBeenCalledWith(10000);
      expect(result).toEqual({
        message: 'X-ray data simulation started with 10000ms interval',
      });
    });

    it('should handle simulation start errors', async () => {
      appService.startSimulation.mockRejectedValue(new Error('Start simulation failed'));

      await expect(controller.startSimulation({})).rejects.toThrow('Start simulation failed');
    });
  });
});