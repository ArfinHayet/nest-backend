import { Injectable } from '@nestjs/common';
import { AnswerRepository } from './entity/answer.repository';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { BadRequestException } from '@nestjs/common';
import { Answer } from './entity/answer.entity';

@Injectable()
export class AnswerService {
  constructor(private readonly answerRepository: AnswerRepository) { }

  async create(dto: CreateAnswerDto): Promise<Answer> {
    // 1️⃣ Check if an answer already exists for the same questionId
    const existingAnswer = await this.answerRepository.findByField('questionId',dto.questionId)

    if (existingAnswer) {
      throw new BadRequestException(
        `Answer already exists for questionId: ${dto.questionId}`
      );
    }
    return this.answerRepository.create(dto);
  }




  async findAll(query: Record<string, any>, includeRelations = true): Promise<Partial<Answer>[]> {
    return this.answerRepository.findAll(query as any, includeRelations); 
  }

  async findById(id: number): Promise<Answer | null> {
    return this.answerRepository.findById(id);
  }

  async remove(id: number): Promise<void> {
    return this.answerRepository.deleteById(id);
  }
}
