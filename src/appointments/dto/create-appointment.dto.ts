export class CreateAppointmentDto {
  patientId: number;
  userId: number;
  clinicianId: number;
  time: Date;
  link?: string;
}
