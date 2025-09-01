// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';    
import { PatientService } from './patient.service';
import { PatientRepository } from './patient.repository';
import { PatientController } from './patient.controller';
import { SubmissionModule } from 'src/submission/submission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]),SubmissionModule],
  providers: [PatientService,PatientRepository],
  exports: [PatientService, PatientRepository], 
  controllers: [PatientController],
})
export class PatientModule {} 
