import { IsObject, IsOptional, IsString } from 'class-validator';

export class SendToDeviceDto {
  @IsString()
  deviceToken: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
