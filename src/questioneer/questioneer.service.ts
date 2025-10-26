import { Injectable } from '@nestjs/common';
import { QuestionnaireRepository } from './questionnaire.repository';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { Questionnaire } from '../questioneer/questioneer.entity';
import { NotFoundException } from '@nestjs/common';
import { QuestionCategory } from 'src/question-category/entity/question-category.entity';

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

  async findAll(query): Promise<Questionnaire[]> {
    const questions = await this.questionnaireRepository.findByJoin(
      QuestionCategory,
      'question_category',
      'entity.questiontypeid = question_category.id',
      query
    );   
    return questions
  }

  async findById(query): Promise<Questionnaire> {
    return this.questionnaireRepository.findById(query as any)
  }

  async delete(id: number): Promise<void> {
    const existing = await this.questionnaireRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Questionnaire with id ${id} not found`);
    }
    await this.questionnaireRepository.deleteById(id);
  }
}
