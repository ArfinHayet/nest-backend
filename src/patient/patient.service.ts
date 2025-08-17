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

  async findAll(query) {
    return this.patientRepository.findAll(query as any)
  }

  async findPatientsByUser(userId: number) {
  return this.patientRepository.findByField('user', { id: userId } as any);
}

}
