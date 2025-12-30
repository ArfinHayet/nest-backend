// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './patient/patient.module';
import { AssessmentModule } from './assessment/assessment.module';
import { QuestioneerModule } from './questioneer/questioneer.module';
import { SubmissionModule } from './submission/submission.module';
import { PaymentModule } from './payment/payment.module';
import { AiSummeryModule } from './ai-summery/ai-summery.module';
import { PrescriptionModule } from './prescription/prescription.module';
import { AvailabilityModule } from './availability/availability.module';
import { LeaveModule } from './leave/leave.module';
import { BlogModule } from './blog/blog.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UploadModule } from './upload/upload.module';
import { ZoomService } from './zoom/zoom.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppointmentsModule } from './appointments/appointments.module';
import { CustomMailerModule } from './mailer/mailer.module'
import { QuestionCategoryModule } from './question-category/question-category.module';
import { MailModule } from './mail/mail.module';
import { BannerModule } from './banner/banner.module';
import { NotificationModule } from './notifications/notifications.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');

        console.log('DATABASE_URL:', dbUrl);
        try {
          console.log('DB HOST:', dbUrl ? new URL(dbUrl).host : 'MISSING');
        } catch (e) {
          console.log('DB URL PARSE ERROR:', e.message);
        }

        return {
          type: 'postgres',
          url: dbUrl,
          autoLoadEntities: true,
          synchronize: true, // ⚠️ Disable in production
          ssl: {
            rejectUnauthorized: false, // ✅ Required by Supabase
          },
        };
      },

    }),

    UsersModule, AuthModule, PatientModule, AssessmentModule, QuestioneerModule, SubmissionModule, PaymentModule, AiSummeryModule, PrescriptionModule, AvailabilityModule, LeaveModule, BlogModule, FirebaseModule, UploadModule, AppointmentsModule, CustomMailerModule, QuestionCategoryModule, MailModule, BannerModule, NotificationModule
  ],
  controllers: [AppController],
  providers: [AppService, ZoomService, CustomMailerModule]
})
export class AppModule { }
