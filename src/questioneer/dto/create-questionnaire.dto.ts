import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateQuestionnaireDto {
  @ApiProperty({
    description: 'The ID of the related assessment',
    example: 1,
  })
  @IsInt()
  assessmentId: number;

  @ApiProperty({
    description: 'The questionnaire questions (can be plain text or JSON)',
    example: 'What is your name?; How old are you?',
  })
  @IsString()
  questions: string;
}
