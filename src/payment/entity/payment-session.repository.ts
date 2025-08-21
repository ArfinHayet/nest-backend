import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentSession } from './payment-session.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class PaymentSessionRepository extends BaseRepository<PaymentSession> {
  constructor(
    @InjectRepository(PaymentSession)
    private readonly paymentSessionRepo: Repository<PaymentSession>,
  ) {
    super(paymentSessionRepo);
  }


}
