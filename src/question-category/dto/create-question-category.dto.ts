// create-question-category.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuestionCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  variant?: string;

  @IsOptional()
  @IsString()
  assessmentId: number;
}
