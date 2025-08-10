import { Module } from '@nestjs/common';
import { Assessment } from './assessment.entity';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service'; 
import { AssessmentRepository } from './assessment.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment])],
  controllers: [AssessmentController],
  exports: [AssessmentService, AssessmentRepository], 
  providers: [AssessmentService, AssessmentRepository]
})
export class AssessmentModule {}
