import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {
    super(paymentRepo);
  }


}
