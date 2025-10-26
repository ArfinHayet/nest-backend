 // question-category.service.ts
import { Injectable } from '@nestjs/common';
import { QuestionCategory } from './entity/question-category.entity';
import { CreateQuestionCategoryDto } from './dto/create-question-category.dto';
import { QuestionCategoryRepository } from './entity/question-category.repository';

@Injectable()
export class QuestionCategoryService {
  constructor(
    private readonly questionCategoryRepository: QuestionCategoryRepository,
  ) {}

  async create(createQuestionCategoryDto: CreateQuestionCategoryDto): Promise<QuestionCategory> {
    return await this.questionCategoryRepository.create(createQuestionCategoryDto);
  }

  async findAll(query?: any) {
    return this.questionCategoryRepository.findAll(query as any);
  }

  async findById(id: number) {
    return this.questionCategoryRepository.findById(id);
  }

  async update(id: number, data: Partial<CreateQuestionCategoryDto>) {
    return this.questionCategoryRepository.update(id, data);
  }

  async findByName(name: string) {
    return this.questionCategoryRepository.findByField('name', name);
  }
}
