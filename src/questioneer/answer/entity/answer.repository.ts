// src/answer/answer.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'src/core/base.repository';
import { Answer } from './answer.entity';

@Injectable()
export class AnswerRepository extends BaseRepository<Answer> {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
  ) {
    super(answerRepo);
  }

  // Only join QuestionCategory (nested)
  protected addCustomJoins(qb: SelectQueryBuilder<Answer>): void {
    qb.leftJoin('question.questionType', 'questionCategory')
      .addSelect(['questionCategory.id', 'questionCategory.name']);
  }

}
