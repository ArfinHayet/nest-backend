import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

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
    description: 'total time in minutes',
    example: '5 minutes',
  })
  @IsString()
  totalTime: string
}
