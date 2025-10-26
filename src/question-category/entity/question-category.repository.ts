// question-category.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionCategory } from './question-category.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class QuestionCategoryRepository extends BaseRepository<QuestionCategory> {
  constructor(
    @InjectRepository(QuestionCategory)
    private readonly questionCategoryRepo: Repository<QuestionCategory>,
  ) {
    super(questionCategoryRepo);
  }
}
