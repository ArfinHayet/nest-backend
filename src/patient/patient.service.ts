import { Injectable } from '@nestjs/common';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientRepository } from './patient.repository';

@Injectable()
export class PatientService {
  constructor(
    private patientRepository: PatientRepository,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    return await this.patientRepository.create(createPatientDto);
  }

  async findAll() {
    return this.patientRepository.findAll()
  }
}
