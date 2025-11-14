// mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { SendGridService } from './sendgrid.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailController } from './mail.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { existsSync } from 'fs';
import { join } from 'path';

const devPath = join(process.cwd(), 'src', 'mail', 'templates');
const prodPath = join(__dirname, 'templates');
const templateDir = existsSync(prodPath) ? prodPath : devPath;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.sendgrid.net',
          port: 587,
          auth: {
            user: 'apikey', // ALWAYS "apikey"
            pass: config.get('SENDGRID_API_KEY'),
          },
        },

        defaults: {
          from: `"No Reply" <${config.get('EMAIL_FROM')}>`,
        },

        // ✅ Only confirmation.hbs will be used
        template: {
          dir: templateDir,
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

  ],
  providers: [SendGridService],
  exports: [SendGridService],
  controllers: [MailController],
})
export class MailModule {}
