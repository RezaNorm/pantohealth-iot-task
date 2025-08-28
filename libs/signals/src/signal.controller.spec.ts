import { Test, TestingModule } from '@nestjs/testing';
import { SignalController } from './signal.controller';
import { SignalService } from './signal.service';

describe('SignalController', () => {
  let controller: SignalController;

  beforeEach(async () => {
    const mockSignalService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignalController],
      providers: [
        {
          provide: SignalService,
          useValue: mockSignalService,
        },
      ],
    }).compile();

    controller = module.get<SignalController>(SignalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
