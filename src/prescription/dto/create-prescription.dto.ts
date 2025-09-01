// src/prescription/dto/create-prescription.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  assessmentId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observation?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  medicine: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  frequency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  duration: string;
}
