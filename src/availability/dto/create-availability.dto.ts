// src/availability/dto/create-availability.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export enum AvailabilityType {
  ALL_DAY = 'all_day',
  SPECIFIC_DAY = 'specific_day',
}

export class CreateAvailabilityDto {
  @ApiProperty({ enum: AvailabilityType, description: 'Type of availability' })
  @IsEnum(AvailabilityType)
  @IsNotEmpty()
  availabilityType: AvailabilityType;

  @ApiProperty({ example: 'Monday', required: false })
  @IsString()
  @IsOptional()
  day?: string;

  @ApiProperty({ example: '09:00:00', required: false })
  @IsString()
  @IsOptional()
  time?: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
