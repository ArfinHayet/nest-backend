import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SendGridService {
  constructor(private readonly mailerService: MailerService) { }

  async sendMail(options: {
    to: string;
    subject: string;
    html?: string;
    template?: string;
    context?: Record<string, any>;
  }) {
    return this.mailerService.sendMail(options);
  }



  @OnEvent('email.otp')
  async sendUserConfirmation(payload: { email: string; otp: string }) {
    console.log('Sending OTP email to:', payload.email);

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Confirm Your Email</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .body {
            padding: 30px 20px;
            text-align: center;
          }
          .body p {
            font-size: 16px;
            color: #333;
          }
          .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #4f46e5;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            padding: 15px 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Hello ${payload.email}</h1>
          </div>
          <div class="body">
            <p>We received a request to confirm your email. Use the OTP below to verify your account:</p>
            <div class="otp-code">${payload.otp}</div>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
            &copy; NeuroCheck Pro. All rights reserved.
          </div>
        </div>
      </body>
      </html>
  `;

    return this.sendMail({
      to: payload.email,
      subject: 'Confirm Your Email',
      template: undefined,  // ensure template is not used
      context: undefined,   // ensure context is not used
      html,                 // full custom HTML
    });
  }



}
