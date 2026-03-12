import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches } from 'class-validator';

export class UpdateClinicDto {
  @ApiProperty({ example: 'City Health Clinic', required: false })
  @IsString()
  @IsOptional()
  clinicName?: string;

  @ApiProperty({ example: 'General Practice', required: false })
  @IsString()
  @IsOptional()
  clinicType?: string;

  @ApiProperty({ example: '123 Main Street', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Chattogram', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '4000', required: false })
  @IsString()
  @IsOptional()
  postCode?: string;

  @ApiProperty({ example: '01712345678', required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Phone number must be between 10 to 15 digits',
  })
  phone?: string;
}
