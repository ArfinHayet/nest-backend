import { IsObject, IsOptional, IsString } from 'class-validator';

export class SendToChannelDto {
  @IsString()
  channel: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
