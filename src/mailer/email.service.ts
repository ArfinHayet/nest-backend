// email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  
  @OnEvent('email.otp')
  async sendUserConfirmation(payload: { email: string; otp: string }) { 

    const result = await this.mailerService.sendMail({
      to: payload.email,
      subject: 'Welcome to Our App! Confirm your Email',
      template: './confirmation', // `confirmation.hbs` in templates folder,
      context: {
        name: 'User',
        email: payload.email || 'email' ,
        otp: payload.otp || 'otp',
      }
    });

    console.log("mail send",result)
  }
}
