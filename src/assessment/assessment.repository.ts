// user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from './assessment.entity';
import { BaseRepository } from '../core/base.repository';

@Injectable()
export class AssessmentRepository extends BaseRepository<Assessment> {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepo: Repository<Assessment>,
  ) {
    super(assessmentRepo);
  } 
}
