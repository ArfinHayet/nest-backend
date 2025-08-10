import { Injectable } from '@nestjs/common';
import { QuestionnaireRepository } from './questionnaire.repository';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { Questionnaire } from '../questioneer/questioneer.entity';

@Injectable()
export class QuestionnaireService {
  constructor(private readonly questionnaireRepository: QuestionnaireRepository) {}

  async create(dto: CreateQuestionnaireDto): Promise<Questionnaire> {
    return this.questionnaireRepository.create(dto);
  }

  async findAll(): Promise<Questionnaire[]> {
    return this.questionnaireRepository.findAll();
  }
}
