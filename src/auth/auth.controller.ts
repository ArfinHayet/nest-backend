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

        // 0. Check if an OTP already exists for this identifier
        const existingOtp = await this.otpService.findOtp(identifier);

        if (existingOtp) {
            const now = new Date();

            if (existingOtp.expiresAt > now) {
                // OTP is still valid
                throw new ConflictException('Cannot send new OTP. An active OTP already exists.');
            } else {
                // OTP is expired — delete it before proceeding
                await this.otpService.removeOtp(existingOtp.id);
            }
        }

        // 1. Send new OTP
        await this.authService.sendOtp(identifier);

        return sendResponse(null, 'OTP sent successfully.', 201);
    }



    @Post('verify-otp')
    async verifyOtp(@Body() dto: { identifier: string; otp: string }) {
        const { identifier, otp } = dto;

        // 1. Get latest OTP entry
        const otpEntry = await this.otpService.findOtp(identifier);
        if (!otpEntry || otpEntry.expiresAt < new Date()) {
            throw new BadRequestException('OTP expired or not found');
        }

        // 2. Verify OTP
        const isValid = await this.otpService.verifyOtp(otp, otpEntry.hashedOtp);
        if (!isValid) {
            throw new UnauthorizedException('Invalid OTP');
        }

        // 3. Optionally remove OTP after use
        await this.otpService.removeOtp(otpEntry.id);

        return sendResponse(
            { verified: true },
            'OTP verified successfully',
            200
        );
    }



    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        const { identifier, otp } = createUserDto;

        // 0. Check if user already exists by email or phone
        const existingUser = await this.usersService.findByEmailOrPhone(identifier);
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


    @Post('login')
    async login(@Body() loginDto: { identifier: string; password: string }) {
        const { identifier, password } = loginDto;

        // 1. Find user by email or phone
        const user = await this.usersService.findByEmailOrPhone(identifier);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 2. Verify password (assuming bcrypt hash stored)
        const isPasswordValid = await this.authService.validateUser(identifier, password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 3. Generate JWT token
        const token = await this.authService.login(user); // returns JWT

        return sendResponse(
            { user, token },
            'User logged in successfully',
            200
        );
    }



}
