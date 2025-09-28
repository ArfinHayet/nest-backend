 // user.repository.ts
 import { Injectable } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { Appointments } from './appointments.entity';
 import { BaseRepository } from 'src/core/base.repository';
 
 @Injectable()
 export class AppointmentsRepository extends BaseRepository<Appointments> {
   constructor(
     @InjectRepository(Appointments)
     private readonly appointmentsRepo: Repository<Appointments>,
   ) {
     super(appointmentsRepo);
   } 
 }
 