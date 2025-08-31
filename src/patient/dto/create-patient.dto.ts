import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description: "Full name of the patient",
    example: "John Doe",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Date of birth of the patient (YYYY-MM-DD)",
    example: "1990-05-15",
  })
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty({
    description: "Gender of the patient",
    example: "Male",
  })
  @IsString()
  gender: string;

  @ApiProperty({
    description: "Relationship of the patient to the user",
    example: "Father",
  })
  @IsString()
  relationshipToUser: string;

  @ApiProperty({
    description: "Information about the patient's GP (General Practitioner)",
    example: "Dr. Smith, City Clinic",
    required: false,
  })
  @IsOptional()
  @IsString()
  aboutGp?: string;

  @ApiProperty({
    description: "Profile tag for the patient",
    example: "George - ADHD",
    required: false,
  })
  @IsOptional()
  @IsString()
  profileTag?: string;



  @ApiProperty({
    description: "Userid ",
    example: "1",
    required: false,
  })
  @IsNumber()
  userId: number;



}
