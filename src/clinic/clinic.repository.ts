//clinic.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './clinic.entity';
import { BaseRepository } from '../core/base.repository';

@Injectable()
export class ClinicRepository extends BaseRepository<Clinic> {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepo: Repository<Clinic>,
  ) {
    super(clinicRepo);
  }
}