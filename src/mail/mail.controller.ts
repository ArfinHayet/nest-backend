import { Controller, Post, Body } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';

@Controller('mail')
export class MailController {
  constructor(private readonly sendGridService: SendGridService) {}

  @Post('send')
  async sendMail(
    @Body()
    body: {
      to: string;
      subject: string;
      html: string; // full HTML template
    },
  ) {
    return this.sendGridService.sendMail({
      to: body.to,
      subject: body.subject,
      html: body.html,
    });
  }
}
