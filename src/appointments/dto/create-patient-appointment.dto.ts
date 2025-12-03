import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePatientAppointmentDto {
  @IsInt()
  userId: number;

  @IsInt()
  patientId: number;

  @IsInt()
  clinicianId: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  tries?: number;
}
