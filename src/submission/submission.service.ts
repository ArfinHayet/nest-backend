import { Injectable, BadRequestException } from '@nestjs/common';
import { SubmissionRepository } from './entity/submission.repository';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submission } from './entity/submission.entity';

@Injectable()
export class SubmissionService {
  constructor(private readonly submissionRepository: SubmissionRepository) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    // Optionally, you can add checks here to ensure patient, assessment, user exist
    // For example: verify assessmentId exists in the database, etc.
    return this.submissionRepository.create(dto);
  }

  async findAll(query: Record<string, any>, includeRelations : boolean): Promise<Submission[]> {
    return this.submissionRepository.findAll(query as any,includeRelations);
  }

    async findByAssessment(id) {
    return this.submissionRepository.findByField('assessmentId',id)
  }
}
