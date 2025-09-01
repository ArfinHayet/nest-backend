import { IsOptional, IsString } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  heading?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
