import { Test, TestingModule } from '@nestjs/testing';
import { SignalService } from './signal.service';
import { MongoService } from '@app/mongo';

describe('SignalService', () => {
  let service: SignalService;

  beforeEach(async () => {
    const mockMongoService = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalService,
        {
          provide: MongoService,
          useValue: mockMongoService,
        },
      ],
    }).compile();

    service = module.get<SignalService>(SignalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
