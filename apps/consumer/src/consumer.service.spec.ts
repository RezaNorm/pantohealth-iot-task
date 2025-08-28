import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerService } from './consumer.service';
import { RabbitMQService } from '@app/rabbitmq';
import { SignalService } from '@app/signals';

describe('ConsumerService', () => {
  let service: ConsumerService;

  beforeEach(async () => {
    const mockRabbitMQService = {};
    const mockSignalService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumerService,
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
        {
          provide: SignalService,
          useValue: mockSignalService,
        },
      ],
    }).compile();

    service = module.get<ConsumerService>(ConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
