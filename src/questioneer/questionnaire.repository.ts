import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnaire } from '../questioneer/questioneer.entity';
import { BaseRepository } from '../core/base.repository';

@Injectable()
export class QuestionnaireRepository extends BaseRepository<Questionnaire> {
  constructor(
    @InjectRepository(Questionnaire)
    private readonly questionnaireRepo: Repository<Questionnaire>,
  ) {
    super(questionnaireRepo);
  }
}
