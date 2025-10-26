// create-question-category.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
