import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoService } from './mongo.service';
import { XRaySignal } from './schemas/xray-signal.schema';

describe('MongoService', () => {
  let service: MongoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongoService,
        {
          provide: getModelToken(XRaySignal.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MongoService>(MongoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
