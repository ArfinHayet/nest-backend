// user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './prescription.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class PrescriptionRepository extends BaseRepository<Prescription> {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
  ) {
    super(prescriptionRepo);
  } 
}
