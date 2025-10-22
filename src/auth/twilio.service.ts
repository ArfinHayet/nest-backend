// src/twilio/twilio.service.ts
import { Injectable,Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import Twilio from 'twilio';

@Injectable()
export class TwilioService {
    private client: Twilio.Twilio;
    private from: string;
    
    private readonly logger = new Logger(TwilioService.name);

    constructor(private configService: ConfigService) {
        const accountSid = this.configService.get<string>('ACf28523be067644afde357b133b776dd4');
        const authToken = this.configService.get<string>('5d101dfc807d37893fe6e8ef44c92e9d');
        this.from = this.configService.get<string>('+447723485041');
        this.client = Twilio(accountSid, authToken);
    }

    @OnEvent('phone.otp', { suppressErrors: false })
    async handlePhoneOtp(payload: { phone: string; otp: string }) {
        const { phone, otp } = payload;

        try {
            const message = await this.client.messages.create({
                body: `Your OTP code is: ${otp}`,
                from: this.from,
                to: phone,
            });

            this.logger.log(`OTP sent to ${phone}, SID: ${message.sid}`);
        } catch (err) {
            this.logger.error(`Failed to send OTP to ${phone}: ${err.message}`);
            // Optional: store failed OTP in DB for retry
        }
    }

}
