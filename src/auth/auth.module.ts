// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { OtpModule } from 'src/otp/otp.module';
import { JwtStrategy } from './jwt.strategy';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { TwilioService } from './twilio.service';

@Module({
  imports: [
    UsersModule,
    OtpModule,
    FirebaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'my-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TwilioService], 
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
