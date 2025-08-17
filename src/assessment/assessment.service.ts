import { Injectable } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AssessmentRepository } from './assessment.repository';
import { Assessment } from './assessment.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AssessmentService {
  constructor(
    private assessmentRepository: AssessmentRepository,
  ) { }

  async create(dto: CreateAssessmentDto): Promise<Assessment> {
    if (dto.type === 'free') {
      const existingFree = await this.assessmentRepository.findByField('type', 'free');
      if (existingFree) {
        throw new BadRequestException('Only one free assessment is allowed');
      }
    }

    return this.assessmentRepository.create(dto);
  }

  async findAll(query) {
    return this.assessmentRepository.findAll(query as any);
  }

  async findById(id) {
    return this.assessmentRepository.findById(id) 
  }
}
