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
  ) {}

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

  async findAll(
    query: Record<string, any>,
    includeRelations: boolean,
  ): Promise<Submission[]> {
    return this.submissionRepository.findAll(query as any, includeRelations);
  }

  async findByAssessment(id): Promise<any> {
    return this.submissionRepository.findByField('assessmentId', id);
  }

  async findByPatientId(id): Promise<any> {
    return this.submissionRepository.findAllByField('patientId', id);
  }

  async updateAssessment(
    id,
    dto: Partial<CreateSubmissionDto>,
  ): Promise<Submission> {
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

  async checkAndAutoAssignClinician(assessmentId: number, patientId: number) {
    // Get all submissions for this assessment + patient
    const submissions = await this.submissionRepository.findAll(
      { assessmentId, patientId },
      false,
    );

    if (!submissions || submissions.length === 0) return null;

    // Get unique question types from submissions
    const submittedTypes = new Set(
      submissions.map((s) => s.questionType).filter(Boolean),
    );

     const allQuestions = await this.dataSource
       .getRepository('Questionnaire')
       .find({ where: { assessmentId } });

     const totalQuestionTypes = new Set(
       allQuestions.map((q) => q.questiontypeid).filter(Boolean),
    ).size;
    
    // Check if all question types submitted
    if (submittedTypes.size < totalQuestionTypes) {
      console.log(
        `Waiting for all question types. Got ${submittedTypes.size}/${totalQuestionTypes}`,
      );
      return null; // Not ready for assignment yet
    }

    // All question types received, proceed with auto-assignment
    console.log('All question types received. Auto-assigning clinician...');

    const clinicians = await this.dataSource
      .getRepository('User')
      .find({ where: { role: 'clinician' } });

    if (!clinicians || clinicians.length === 0) {
      throw new BadRequestException('No clinicians available');
    }

    // Calculate load
    const clinicianLoad = [];
    for (const c of clinicians) {
      const count = await this.submissionRepository.countByClinician(c.id);
      clinicianLoad.push({ id: c.id, count });
    }

    clinicianLoad.sort((a, b) => a.count - b.count);
    const selectedClinicianId = clinicianLoad[0].id;

    // Update ALL submissions for this assessment + patient
    for (const sub of submissions) {
      await this.updateAssessment(sub.id, {
        clinicianId: selectedClinicianId,
        isAutoAssigned: true,
        clinician_approved: false,
      } as any);
    }

    return selectedClinicianId;
  }
}
