import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DevicePlatform } from '../entities/device.entity';

export class RegisterDeviceDto {
  @IsString()
  deviceToken: string;

  @IsEnum(DevicePlatform)
  platform: DevicePlatform;

  @IsOptional()
  userId?: number;
}
