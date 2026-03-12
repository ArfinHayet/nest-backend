import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateClinicDto {
  // Clinic Info
  @ApiProperty({ example: 'City Health Clinic' })
  @IsString()
  @IsNotEmpty()
  clinicName: string;

  @ApiProperty({ example: 'General Practice' })
  @IsString()
  @IsNotEmpty()
  clinicType: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Chattogram' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: '4000' })
  @IsString()
  @IsNotEmpty()
  postCode: string;

  @ApiProperty({ example: '01712345678' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must be between 10 to 15 digits',
  })
  phone: string;

  // User Info
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'clinic@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
