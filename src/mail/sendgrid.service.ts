import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendGridService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string, html?: string) {
    return this.mailerService.sendMail({
      to,
      subject,
      text,
      html,
    });
  }
}
