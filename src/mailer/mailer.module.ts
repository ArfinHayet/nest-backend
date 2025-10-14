// mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { existsSync } from 'fs';
import { join } from 'path';
import { EmailService } from './email.service';


const devPath = join(process.cwd(), 'src', 'mailer', 'templates');
const prodPath = join(__dirname, 'templates');
const templateDir = existsSync(prodPath) ? prodPath : devPath;


@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtpout.secureserver.net', // Or your SMTP host
        port: 465,
        secure: true,
        auth: {
          user: 'arshad@neurocheckpro.com',
          pass: 'DJHagyvu5pz',
        },
      },
      defaults: {
        from: '"NeuroCheck Pro" <arshad@neurocheckpro.com>',
      },
      template: {
        dir: templateDir, // ✅ Works in both dist and src
        adapter: new HandlebarsAdapter(),
        options: { strict: true }
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class CustomMailerModule {}
