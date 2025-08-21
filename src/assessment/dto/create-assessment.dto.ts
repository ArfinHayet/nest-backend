import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNumber, ValidateIf, Min, Max } from 'class-validator';

export class CreateAssessmentDto {
  @ApiProperty({
    description: 'Name of the assessment',
    example: 'Cognitive Ability Test',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Detailed description of the assessment',
    example: 'This assessment measures your memory, attention, and reasoning abilities.',
  })
  @IsString()
  description: string;
  
  @ApiProperty({
    description: 'Type of the assessment',
    example: 'free',
    enum: ['free', 'premium'],
  })
  @IsString()
  @IsIn(['free', 'premium'])
  type: 'free' | 'premium';
  
  @ApiProperty({
    description: 'Total time in minutes',
    example: '5 minutes',
  })
  @IsString()
  totalTime: string;

  @ApiProperty({
    description: 'Category of the assessment',
    example: 'Aptitude Test',
  })
  @IsString()
  category: string;

  // ✅ Single price field with conditional validation
  @ApiProperty({
    description: 'Price of the assessment (0 if free, >0 if premium)',
    example: 9.99,
  })
  @IsNumber()
  @ValidateIf(o => o.type === 'free')
  @Max(0, { message: 'Price must be 0 when type is free' })
  @ValidateIf(o => o.type === 'premium')
  @Min(1, { message: 'Price must be greater than 0 when type is premium' })
  price: number;
}
