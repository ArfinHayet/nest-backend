import { Test, TestingModule } from '@nestjs/testing';
import { QuestioneerService } from './questioneer.service';

describe('QuestioneerService', () => {
  let service: QuestioneerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestioneerService],
    }).compile();

    service = module.get<QuestioneerService>(QuestioneerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
