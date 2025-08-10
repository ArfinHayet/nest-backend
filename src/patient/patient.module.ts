// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';    
import { PatientService } from './patient.service';
import { PatientRepository } from './patient.repository';
import { PatientController } from './patient.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  providers: [PatientService,PatientRepository],
  exports: [PatientService, PatientRepository], 
  controllers: [PatientController],
})
export class PatientModule {} 
