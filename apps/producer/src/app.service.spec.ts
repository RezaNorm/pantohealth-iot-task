import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { RabbitMQService } from '@app/rabbitmq';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const mockRabbitMQService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
