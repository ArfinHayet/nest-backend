import { Injectable } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AssessmentRepository } from './assessment.repository';

@Injectable()
export class AssessmentService {
  constructor(
    private assessmentRepository: AssessmentRepository,
  ) {}

  async create(dto: CreateAssessmentDto) {
    return await this.assessmentRepository.create(dto);
  }

  async findAll() {
    return this.assessmentRepository.findAll();  
  }
}
