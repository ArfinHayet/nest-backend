// src/users/dto/update-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  Max,
  Matches,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  // @ValidateIf((o) => !o.phone)
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: '01712345678', required: false })
  // @ValidateIf((o) => !o.email)
  @IsString()
  @Matches(/^[0-9]{10,15}$/, { message: 'Phone number must be between 10 to 15 digits' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 30, minimum: 0, maximum: 150, required: false })
  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  age?: number;

  @ApiProperty({ example: 'Bangladesh', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'Chattogram', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ example: '4000', required: false })
  @IsString()
  @IsOptional()
  postCode?: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({ example: 'user', description: 'Role of the user (e.g., user, admin)', required: false })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ example: 'Facebook', description: 'How the user came to know about the app', required: false })
  @IsString()
  @IsOptional()
  knowHow?: string;


  @ApiProperty({ example: 'image.png', description: 'image.png', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: '123456', description: 'One Time Password sent to user', required: false })
  @IsString()
  @IsOptional()
  otp?: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email or phone used for verification', required: false })
  @IsString()
  @IsOptional()
  identifier?: string; // email or phone

  // ✅ Optional extra fields
  @ApiProperty({ example: 'HCPC Title', required: false })
  @IsString()
  @IsOptional()
  hcpcTitle?: string;

  @ApiProperty({ example: 'REG12345', required: false })
  @IsString()
  @IsOptional()
  regNo?: string;

  @ApiProperty({ example: 'My Practice Name', required: false })
  @IsString()
  @IsOptional()
  practiceName?: string;

  @ApiProperty({ example: 'certification.pdf', required: false })
  @IsString()
  @IsOptional()
  certification?: string; // file path or URL
}
