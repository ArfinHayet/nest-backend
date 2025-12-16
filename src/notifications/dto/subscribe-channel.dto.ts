import { IsArray, IsString } from 'class-validator';

export class SubscribeChannelDto {
  @IsArray()
  deviceTokens: string[];

  @IsString()
  channel: string;
}
