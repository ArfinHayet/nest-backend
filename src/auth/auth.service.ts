// auth.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { OtpService } from '../otp/otp.service';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/user.repository';
import { OtpRepository } from 'src/otp/otp.repository';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OtpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async sendOtp(identifier: string): Promise<{ message: string }> {
    try {
      const isEmailAddress = isEmail(identifier);

      // Generate OTP
      const otp = this.otpService.generateOtp();
      const hashedOtp = await this.otpService.hashOtp(otp);
      const expiresAt = this.otpService.getExpiryDate();

      // Save OTP in DB
      await this.otpService.saveOtp(identifier, hashedOtp, expiresAt);
      // Send OTP
      if (isEmailAddress) {
        // TODO: implement email sending
        // await this.sendOtpByEmail(identifier, otp);
        this.eventEmitter.emit('email.otp', { email: identifier, otp });
      } else {
        // Phone OTP via EventEmitter
        this.eventEmitter.emit('phone.otp', { phone: identifier, otp });
      }

      return { message: "OTP generated. Sending in progress." };
    } catch (err) {
      console.error('Error sending OTP:', err);
      throw new InternalServerErrorException('Failed to send OTP. Please try again.');
    }
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
