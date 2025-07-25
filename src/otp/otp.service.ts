// otp.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { OtpRepository } from './otp.repository';

@Injectable()
export class OtpService {

  constructor(
    private readonly otpRepo: OtpRepository
  ) { }
  private OTP_EXPIRY_MINUTES = 5;


  async findOtp(identifier: string) {
    return  await this.otpRepo.findOneByCondition({ identifier }, 'createdAt')
  }

  async removeOtp(id: number) {
    return await this.otpRepo.deleteById(id)
  }

  async saveOtp(identifier: string,hashedOtp : string,expiresAt : Date) {
    // Store OTP in DB
    return await this.otpRepo.create({
      identifier,
      hashedOtp,
      expiresAt,
    });
  }
  generateOtp(): string {
    // return randomInt(100000, 999999).toString(); // 6-digit code
    return '5431';
  }

  async hashOtp(otp: string): Promise<string> {
    return await bcrypt.hash(otp, 10);
  }

  async verifyOtp(providedOtp: string, hashedOtp: string): Promise<boolean> {
    return await bcrypt.compare(providedOtp, hashedOtp);
  }

  getExpiryDate(): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);
    return expiresAt;
  }
}
