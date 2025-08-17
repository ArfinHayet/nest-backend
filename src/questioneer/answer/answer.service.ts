import { Injectable } from '@nestjs/common';
import { AnswerRepository } from './entity/answer.repository';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entity/answer.entity';

@Injectable()
export class AnswerService {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async create(dto: CreateAnswerDto): Promise<Answer> {
    const newAnswer = await this.answerRepository.create(dto);
    return newAnswer;
  }



  async findAll(): Promise<Answer[]> {
    return this.answerRepository.findAll();
  }

  async findById(id: number): Promise<Answer | null> {
    return this.answerRepository.findById(id);
  }

  async remove(id: number): Promise<void> {
    return this.answerRepository.deleteById(id);
  }
}
