import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID of the patient',
    example: 101,
  })
  @IsNumber()
  patientId: number;

  @ApiProperty({
    description: 'ID of the user creating the appointment',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'ID of the clinician assigned to the appointment',
    example: 12,
  })
  @IsNumber()
  clinicianId: number;

  @ApiProperty({
    description: 'Scheduled date and time of the appointment',
    example: '2025-10-07T15:00:00Z',
  })
  @Type(() => Date) // ✅ Automatically converts string to Date
  @IsDate()
  time: Date;

  @ApiProperty({
    description: 'Timezone of the appointment',
    example: 'Europe/London',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    description: 'Zoom meeting join link',
    example: 'https://zoom.us/j/1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({
    description: 'Zoom meeting ID',
    example: '1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  meetingId?: string;

  @ApiProperty({
    description: 'Password for the Zoom meeting',
    example: 'abcd123',
    required: false,
  })
  @IsOptional()
  @IsString()
  meetingPassword?: string;

  @ApiProperty({
    description: 'Display name for the Zoom participant',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsString()
  feedback: string;

  @IsOptional()
  @IsString()
  diagosis_recommendation: string;
}
