import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

}
