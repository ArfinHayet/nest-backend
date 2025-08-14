import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class UpdateQuestionnaireDto {
  @IsOptional()
  @IsNumber()
  assessmentId?: number;

  @IsOptional()
  @IsString()
  questions?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsString()
  answerType?: string;
}
