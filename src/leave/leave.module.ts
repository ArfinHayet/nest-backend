// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leave } from '../leave/dto/leave.entity';    
import { LeaveService } from './leave.service';
import { LeaveRepository } from './dto/leave.repository';
import { LeaveController } from './leave.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Leave])],
  providers: [LeaveService,LeaveRepository],
  exports: [LeaveService, LeaveRepository], 
  controllers: [LeaveController],
})
export class LeaveModule {} 
