import { Module } from '@nestjs/common';
import { Submission } from './entity/submission.entity';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service'; 
import { SubmissionRepository } from './entity/submission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentModule } from 'src/assessment/assessment.module';
import { AiSummeryModule } from 'src/ai-summery/ai-summery.module';
import { QuestioneerModule } from 'src/questioneer/questioneer.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Submission]),AssessmentModule, AiSummeryModule, QuestioneerModule,PaymentModule],
  controllers: [SubmissionController],
  exports: [SubmissionService, SubmissionRepository], 
  providers: [SubmissionService, SubmissionRepository, AiSummeryModule,QuestioneerModule,PaymentModule]
})
export class SubmissionModule {}
