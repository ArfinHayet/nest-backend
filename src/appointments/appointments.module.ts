import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './entity/appointments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from './entity/appointments.entity';
import { PatientAppointmentService } from './patient-appointment.service';
import { PatientAppointmentRepository } from './entity/patient-appointment.repository';
import { PatientAppointmentController } from './patient-appointment.controller';
import { PatientAppointment } from './entity/patient-appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments]),TypeOrmModule.forFeature([PatientAppointment])],
  providers: [AppointmentsService, AppointmentsRepository, PatientAppointmentService, PatientAppointmentRepository], // 👈 register here
  controllers: [AppointmentsController, PatientAppointmentController],
  exports: [AppointmentsRepository, AppointmentsService, PatientAppointmentService, PatientAppointmentRepository], // 👈 export here
})
export class AppointmentsModule {}
