import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNumber, IsEnum, IsArray, IsOptional } from 'class-validator';

export enum AnswerType {
  YES_NO = 'Yes/No',
  TEXT = 'Text',
  MULTIPLE_CHOICE = 'MultipleChoice',
}

export enum QuestionVariant {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export class OptionWithScore {
  @ApiProperty({ example: 'Yes' })
  @IsString()
  label: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  score: number;
}


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

  @ApiProperty({
    description: 'Order of the question',
    example: 1,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    description: 'Answer type',
    enum: AnswerType,
    example: AnswerType.YES_NO,
  })
  @IsEnum(AnswerType)
  answerType: AnswerType;

  // ✅ New field
//   @ApiProperty({
//     description: 'Available options for the question (used if answerType is MultipleChoice)',
//     example: ['Option A', 'Option B', 'Option C'],
//     required: false,
//   })
//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   // options?: string[];
//  options?: { label: string; score: number }[];

   @ApiProperty({
    description: 'Available options for the question (used if answerType is MultipleChoice)',
    example: [
      { label: 'Yes', score: 1 },
      { label: 'No', score: 0 }
    ],
     required: false,
        type: [OptionWithScore],

  })
  @IsArray()
  @IsOptional()
  options?: OptionWithScore[];


  @IsNumber()
  @IsOptional()
  questiontypeid: number;


  @IsString()
  @IsEnum(QuestionVariant, { message: 'Variant must be one of: multiple_choice, true_false, short_answer' })
  @IsOptional()
  variant: string; // Foreign key column
}
