import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  heading: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
