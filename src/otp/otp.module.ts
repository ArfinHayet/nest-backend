// src/otps/otps.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './otp.entity';    
import { OtpService } from './otp.service';
import { OtpRepository  } from './otp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository], 
  controllers: [],
})
export class OtpModule {}
