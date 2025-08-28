import { Injectable } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AssessmentRepository } from './assessment.repository';
import { Assessment } from './assessment.entity';
import { BadRequestException } from '@nestjs/common';
import { Questionnaire } from 'src/questioneer/questioneer.entity';
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
    // Assuming AssessmentRepository extends BaseRepository<Assessment>
    const assessments = await this.assessmentRepository.findByJoin(
      Questionnaire, // entity class, not string
      'questionnaire',
      'entity.id = questionnaire.assessmentId',
      query
    );
    return assessments
  }

  async findById(id) {
    return this.assessmentRepository.findById(id)
  }

  async delete(id: number): Promise<void> {
   return this.assessmentRepository.deleteById(id);
  }

}
