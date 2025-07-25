import { NotFoundException, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { sendResponse } from 'src/utils/send-response';
import { AuthService } from './auth.service';
import { OtpService } from 'src/otp/otp.service';
import { DataSource } from 'typeorm';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private otpService: OtpService,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }


    @Post('send-otp')
    async sendOtp(@Body() dto: { identifier: string }) {

        const { identifier } = dto;
        // Check if user exists
        const user = await this.usersService.findByEmailOrPhone(identifier);

        if (user) {
            throw new NotFoundException('User found with provided identifier');
        }
        await this.authService.sendOtp(dto.identifier);
        return sendResponse(null, 'Otp send successfully.', 201)
    }

    // auth.controller.ts
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        const { identifier, otp, email, phone } = createUserDto;

        // 0. Check if user already exists by email or phone
        const existingUser = await this.usersService.findByEmailOrPhone(email ? email : phone);
        if (existingUser) {
            throw new ConflictException('User already exists with this email or phone number');
        }

        // 1. Get latest OTP entry for this identifier
        const otpEntry = await this.otpService.findOtp(identifier)
        if (!otpEntry || otpEntry.expiresAt < new Date()) {
            throw new BadRequestException('OTP expired or not found');
        }

        // 2. Verify OTP
        const isValid = await this.otpService.verifyOtp(otp, otpEntry.hashedOtp);
        if (!isValid) {
            throw new UnauthorizedException('Invalid OTP');
        }

        // 3. Remove OTP after use (optional but secure)
        await this.otpService.removeOtp(otpEntry.id)

        // 4. Create user (excluding otp from dto)
        const user = await this.usersService.create(createUserDto);

        // 5. Generate JWT
        const token = await this.authService.login(user); // assume login() returns JWT token

        return sendResponse(
            { user, token },
            'User created and logged in successfully',
            201
        );
    }


}
