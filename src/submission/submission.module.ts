import { Module } from '@nestjs/common';
import { Submission } from './entity/submission.entity';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service'; 
import { SubmissionRepository } from './entity/submission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentModule } from 'src/assessment/assessment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Submission]),AssessmentModule],
  controllers: [SubmissionController],
  exports: [SubmissionService, SubmissionRepository], 
  providers: [SubmissionService, SubmissionRepository]
})
export class SubmissionModule {}
