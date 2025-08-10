import { Test, TestingModule } from '@nestjs/testing';
import { QuestioneerController } from './questioneer.controller';

describe('QuestioneerController', () => {
  let controller: QuestioneerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestioneerController],
    }).compile();

    controller = module.get<QuestioneerController>(QuestioneerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
