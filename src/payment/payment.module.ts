import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { PaymentSession } from './entity/payment-session.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './entity/payment.repository';
import { PaymentSessionRepository } from './entity/payment-session.repository';
import { AssessmentModule } from 'src/assessment/assessment.module';
import { PatientModule } from 'src/patient/patient.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentSession]),
    forwardRef(() => AssessmentModule),
    forwardRef(() => PatientModule),
  ],
  providers: [PaymentService, PaymentRepository, PaymentSessionRepository],
  exports: [PaymentService, PaymentRepository, PaymentSessionRepository],
  controllers: [PaymentController],
})
export class PaymentModule {}
