import {
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
    ConflictException
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { sendResponse } from 'src/utils/send-response';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { DataSource } from 'typeorm';
import { SendOtpDto } from './dto/auto.dto';
import { VerifyOtpDto } from './dto/auto.dto';
import { LoginDto } from './dto/auto.dto';

// ====== Controller ======
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private otpService: OtpService,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    @Post('send-otp')
    async sendOtp(@Body() dto: SendOtpDto) {
        const { identifier } = dto;

        const existingOtp = await this.otpService.findOtp(identifier);
        if (existingOtp) {
            const now = new Date();
            if (existingOtp.expiresAt > now) {
                throw new ConflictException('Cannot send new OTP. An active OTP already exists.');
            } else {
                await this.otpService.removeOtp(existingOtp.id);
            }
        }

        await this.authService.sendOtp(identifier);
        return sendResponse(null, 'OTP sent successfully.', 201);
    }

    @Post('verify-otp')
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        const { identifier, otp } = dto;

        const otpEntry = await this.otpService.findOtp(identifier);
        if (!otpEntry || otpEntry.expiresAt < new Date()) {
            throw new BadRequestException('OTP expired or not found');
        }

        const isValid = await this.otpService.verifyOtp(otp, otpEntry.hashedOtp);
        if (!isValid) {
            throw new UnauthorizedException('Invalid OTP');
        }

        await this.otpService.removeOtp(otpEntry.id);
        return sendResponse({ verified: true }, 'OTP verified successfully', 200);
    }

    // Signup left without ApiProperty as requested
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        const { identifier, otp } = createUserDto;

        const existingUser = await this.usersService.findByEmailOrPhone(identifier);
        if (existingUser) {
            throw new ConflictException('User already exists with this email or phone number');
        }

        if (createUserDto.role === "admin") {
            const user = await this.usersService.create(createUserDto);
            const token = await this.authService.login(user);
            return sendResponse({ user, token }, 'User created and logged in successfully', 201);
        }

        const otpEntry = await this.otpService.findOtp(identifier);
        if (!otpEntry || otpEntry.expiresAt < new Date()) {
            throw new BadRequestException('OTP expired or not found');
        }

        const isValid = await this.otpService.verifyOtp(otp, otpEntry.hashedOtp);
        if (!isValid) {
            throw new UnauthorizedException('Invalid OTP');
        }

        await this.otpService.removeOtp(otpEntry.id);
        const user = await this.usersService.create(createUserDto);
        const token = await this.authService.login(user);

        return sendResponse({ user, token }, 'User created and logged in successfully', 201);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const { identifier, password } = loginDto;

        const user = await this.usersService.findByEmailOrPhone(identifier);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.authService.validateUser(identifier, password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.authService.login(user);
        return sendResponse({ user, token }, 'User logged in successfully', 200);
    }
}
