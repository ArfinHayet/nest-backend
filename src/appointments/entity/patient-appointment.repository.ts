import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PatientAppointment } from './patient-appointment.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class PatientAppointmentRepository extends BaseRepository<PatientAppointment> {
  constructor(
    @InjectRepository(PatientAppointment)
    private readonly patientAppointmentRepo: Repository<PatientAppointment>,
  ) {
    super(patientAppointmentRepo);
  }
}
