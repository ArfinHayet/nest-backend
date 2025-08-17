import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'ID of the patient',
    example: 1,
  })
  @IsInt()
  patientId: number;

  @ApiProperty({
    description: 'ID of the assessment',
    example: 5,
  })
  @IsInt()
  assessmentId: number;

  @ApiProperty({
    description: 'ID of the user who submitted',
    example: 10,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Score achieved in the assessment',
    example: 85,
  })
  @IsInt()
  score: number;

  @ApiProperty({
    description: 'Summary or comments about the submission',
    example: 'Good understanding of the topics tested.',
    required: false,
  })
  @IsString()
  @IsOptional()
  summary?: string;
}
