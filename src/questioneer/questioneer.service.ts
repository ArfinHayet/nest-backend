import { Injectable } from '@nestjs/common';
import { QuestionnaireRepository } from './questionnaire.repository';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { Questionnaire } from '../questioneer/questioneer.entity';

@Injectable()
export class QuestionnaireService {
  constructor(private readonly questionnaireRepository: QuestionnaireRepository) { }

  async create(dto: CreateQuestionnaireDto): Promise<Questionnaire> {
    // Use the repository's insertWithOrder method
    const newQuestionnaire = await this.questionnaireRepository.create(dto, dto.order);
    return newQuestionnaire;
  }


  async update(id : number, dto: Partial<UpdateQuestionnaireDto>): Promise<Questionnaire> {
    // Use the repository's insertWithOrder method
    const newQuestionnaire = await this.questionnaireRepository.update(id, dto , dto.order);
    return newQuestionnaire;
  }

  async findAll(): Promise<Questionnaire[]> {
    return this.questionnaireRepository.findAll();
  }
}
