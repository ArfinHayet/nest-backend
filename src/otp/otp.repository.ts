 // user.repository.ts
 import { Injectable } from '@nestjs/common';
 import { InjectRepository } from '@nestjs/typeorm';
 import { Repository } from 'typeorm';
 import { Otp } from './otp.entity';
 import { BaseRepository } from '../../core/base.repository';
 
 @Injectable()
 export class OtpRepository extends BaseRepository<Otp> {
   constructor(
     @InjectRepository(Otp)
     private readonly otpRepo: Repository<Otp>,
   ) {
     super(otpRepo);
   }
 }
 