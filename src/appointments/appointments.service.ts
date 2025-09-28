import { Injectable } from '@nestjs/common';
import { Appointments } from './entity/appointments.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentsRepository } from './entity/appointments.repository';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentRepository: AppointmentsRepository,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointments> {
    return await this.appointmentRepository.create(createAppointmentDto);
  }

  async findAll(query) {
    return this.appointmentRepository.findAll(query as any);
  }

  async findById(id: number) {
    return this.appointmentRepository.findById(id);
  }

  async update(id: number, data: Partial<CreateAppointmentDto>) {
    return this.appointmentRepository.update(id, data);
  }

  async findAppointmentsByPatient(patientId: number) {
    return this.appointmentRepository.findByField('patientId', patientId);
  }

  async findAppointmentsByClinician(clinicianId: number) {
    return this.appointmentRepository.findByField('clinicianId', clinicianId);
  }

  async findAppointmentsByUser(userId: number) {
    return this.appointmentRepository.findByField('userId', userId);
  }
}
