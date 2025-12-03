import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientAppointmentDto } from './create-patient-appointment.dto';

export class UpdatePatientAppointmentDto extends PartialType(CreatePatientAppointmentDto) {}
