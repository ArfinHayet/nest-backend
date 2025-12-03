import { Injectable } from '@nestjs/common';
import { PatientAppointment } from './entity/patient-appointment.entity';
import { CreatePatientAppointmentDto } from './dto/create-patient-appointment.dto';
import { PatientAppointmentRepository } from './entity/patient-appointment.repository';

@Injectable()
export class PatientAppointmentService {
  constructor(
    private readonly patientAppointmentRepository: PatientAppointmentRepository,
  ) {}

  // 🔹 Create
  async create(
    createPatientAppointmentDto: CreatePatientAppointmentDto,
  ): Promise<PatientAppointment> {
    return await this.patientAppointmentRepository.create(
      createPatientAppointmentDto,
    );
  }

  // 🔹 Find all with filters
  async findAll(query: any) {
    return this.patientAppointmentRepository.findAll(query as any, true);
  }

  // 🔹 Find by ID
  async findById(id: number) {
    return this.patientAppointmentRepository.findById(id);
  }

  // 🔹 Update
  async update(id: number, data: Partial<CreatePatientAppointmentDto>) {
    return this.patientAppointmentRepository.update(id, data);
  }

  // 🔹 Filter methods
  async findByPatient(patientId: number) {
    return this.patientAppointmentRepository.findByField('patientId', patientId);
  }

  async findByClinician(clinicianId: number) {
    return this.patientAppointmentRepository.findByField('clinicianId', clinicianId);
  }

  async findByUser(userId: number) {
    return this.patientAppointmentRepository.findByField('userId', userId);
  }
}
