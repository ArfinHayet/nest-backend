// src/question/dto/create-answer.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty({ example: 1, description: 'ID of the question being answered' })
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty({ example: 5, description: 'ID of the user who is answering' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 12, description: 'ID of the patient linked to this answer' })
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({ example: 'Yes/No', description: 'Yes/No' })
  @IsString()
  @IsNotEmpty()
  answer: string; 

  @ApiProperty({ example: '2', description: 'Assessment Id' })
  @IsNumber()
  @IsNotEmpty()
  assessmentId: number; 

}
