import { Module } from '@nestjs/common';
import { Payment } from './entity/payment.entity';
import { PaymentSession } from './entity/payment-session.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './entity/payment.repository';
import { PaymentSessionRepository } from './entity/payment-session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([Payment]),TypeOrmModule.forFeature([PaymentSession])],
  providers: [PaymentService,PaymentRepository, PaymentSessionRepository],
  exports:[PaymentService,PaymentRepository,PaymentSessionRepository],
  controllers: [PaymentController],
  
})
export class PaymentModule {}
