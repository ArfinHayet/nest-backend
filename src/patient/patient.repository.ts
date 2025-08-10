 // user.repository.ts
 import { Injectable } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { Patient } from './patient.entity';
 import { BaseRepository } from '../core/base.repository';
 
 @Injectable()
 export class PatientRepository extends BaseRepository<Patient> {
   constructor(
     @InjectRepository(Patient)
     private readonly patientRepo: Repository<Patient>,
   ) {
     super(patientRepo);
   } 
 }
 