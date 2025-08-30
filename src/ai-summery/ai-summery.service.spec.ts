import { Test, TestingModule } from '@nestjs/testing';
import { AiSummeryService } from './ai-summery.service';

describe('AiSummeryService', () => {
  let service: AiSummeryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiSummeryService],
    }).compile();

    service = module.get<AiSummeryService>(AiSummeryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
