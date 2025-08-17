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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],  
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true, // ⚠️ Disable in production
        ssl: {
          rejectUnauthorized: false, // ✅ Required by Supabase
        },
      }),
    }),

    UsersModule, AuthModule, PatientModule, AssessmentModule, QuestioneerModule, SubmissionModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
   