import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SubmissionRepository } from './entity/submission.repository';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submission } from './entity/submission.entity';
import { Answer } from 'src/questioneer/answer/entity/answer.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly submissionRepository: SubmissionRepository,
    private readonly dataSource: DataSource,
  ) { }

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    return await this.dataSource.transaction(async (manager) => {
      // Step 1: create & save submission
      const submission = manager.create(Submission, dto);
      await manager.save(submission);

      // Step 2: bulk insert answers (if provided)
      if (dto.answers && dto.answers.length > 0) {
        const answers = dto.answers.map((answer) =>
          manager.create(Answer, {
            ...answer,
            submissionId: submission.id, // link answers to this submission
          }),
        );
        await manager.save(answers); // saves all answers in bulk
      }

      return submission;
    });
  }

  async findAll(query: Record<string, any>, includeRelations: boolean): Promise<Submission[]> {
    return this.submissionRepository.findAll(query as any, includeRelations);
  }

  async findByAssessment(id): Promise<any> {
    return this.submissionRepository.findByField('assessmentId', id);
  }

  async findByPatientId(id): Promise<any> {
    return this.submissionRepository.findAllByField('patientId', id);
  }

  async updateAssessment(id, dto: Partial<CreateSubmissionDto>): Promise<Submission> {
    const submission = await this.submissionRepository.findById(id);
    if (!submission) {
      throw new BadRequestException('Submission not found');
    }
    Object.assign(submission, dto);
    return this.submissionRepository.create(submission);
  }

  // ✅ DELETE METHOD
  async deleteAssessment(id: number): Promise<void> {
    // const category = await this.submissionRepository.findById(id);
    // if (!category) {
    //   throw new NotFoundException('Question category not found');
    // }

    await this.submissionRepository.deleteByField('assessmentId', id);
  }


  async countByClinicianId(clinicianId: number) {
  return this.submissionRepository.countByClinician(clinicianId);
}


}
