// auth.service.ts
import { Injectable } from '@nestjs/common';
import bcrypt from "bcrypt"
import { User } from '../users/user.entity';
import { OtpService } from '../otp/otp.service';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/user.repository';
import { OtpRepository } from 'src/otp/otp.repository';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async sendOtp(identifier: string): Promise<{ message: string }> {
    const isEmailAddress = isEmail(identifier);
    // Generate OTP and hash it
    const otp = this.otpService.generateOtp();
    const hashedOtp = await this.otpService.hashOtp(otp);
    const expiresAt = this.otpService.getExpiryDate();

    // Store OTP in DB
    await this.otpService.saveOtp(
      identifier,
      hashedOtp,
      expiresAt);

    // Send OTP via appropriate channel
    if (isEmailAddress) {
      //   await sendOtpByEmail(identifier, otp);
    } else {
      //   await sendOtpBySms(identifier, otp); // you must implement this
    }

    return;
  }


  async validateUser(emailOrPhone: string, password: string): Promise<User | null> {
    const user: any = await this.usersService.findByEmailOrPhone(emailOrPhone);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
