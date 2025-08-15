// src/question/dto/update-answer.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAnswerDto } from './create-answer.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAnswerDto extends PartialType(CreateAnswerDto) {
  @ApiPropertyOptional({ example: 'Updated answer text', description: 'Optional updated answer' })
  answer?: string;
}
