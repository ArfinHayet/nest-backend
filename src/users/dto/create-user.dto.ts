import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ example: 'StrongP@ssw0rd' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '01712345678', required: false })
  @ValidateIf((o) => !o.email)
  @IsString()
  @Matches(/^[0-9]{10,15}$/, { message: 'Phone number must be between 10 to 15 digits' })
  @IsNotEmpty()
  phone?: string;

  @ApiProperty({ example: 30, minimum: 0, maximum: 150, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @ApiProperty({ example: 'Bangladesh', nullable: true })
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty({ example: 'Chattogram', nullable: true })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({ example: '4000', nullable: true })
  @IsString()
  @IsOptional()
  postCode: string;

  @ApiProperty({ example: '123 Main Street', nullable: true })
  @IsString()
  @IsOptional()
  street: string;

  @ApiProperty({ example: 'user', description: 'Role of the user (e.g., user, admin, clinician)' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'Facebook', description: 'How the user came to know about the app' })
  @IsString()
  @IsOptional()
  knowHow: string;

  @ApiProperty({ example: '123456', description: 'One Time Password sent to user' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email or phone used for verification' })
  @IsString()
  @IsNotEmpty()
  identifier: string; // email or phone

  // ✅ Optional extra fields
  @ApiProperty({ example: 'HCPC Title', required: false, nullable: true })
  @IsString()
  @IsOptional()
  hcpcTitle?: string;

  @ApiProperty({ example: 'REG12345', required: false, nullable: true })
  @IsString()
  @IsOptional()
  regNo?: string;

  @ApiProperty({ example: 'My Practice Name', required: false, nullable: true })
  @IsString()
  @IsOptional()
  practiceName?: string;

  @ApiProperty({ example: 'certification.pdf', required: false, nullable: true })
  @IsString()
  @IsOptional()
  certification?: string; // file path or URL

  @IsString()
  @IsOptional()
  firebaseUid: string


  @IsString()
  @IsOptional()
  image: string
}
