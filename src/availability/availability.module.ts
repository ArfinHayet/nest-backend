import { Module } from '@nestjs/common';
import { Availability } from './dto/availability.entity';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service'; 
import { AvailabilityRepository } from './dto/availability.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentModule } from 'src/assessment/assessment.module';
import { AiSummeryModule } from 'src/ai-summery/ai-summery.module';
import { QuestioneerModule } from 'src/questioneer/questioneer.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Availability]),AssessmentModule, AiSummeryModule, QuestioneerModule,PaymentModule],
  controllers: [AvailabilityController],
  exports: [AvailabilityService, AvailabilityRepository], 
  providers: [AvailabilityService, AvailabilityRepository, AiSummeryModule,QuestioneerModule]
})
export class AvailabilityModule {}
