// user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class SubmissionRepository extends BaseRepository<Submission> {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepo: Repository<Submission>,
  ) {
    super(submissionRepo);
  }


  async countByClinician(clinicianId: number): Promise<number> {
    return this.repo.count({
      where: { clinicianId },
    });
  }

}
