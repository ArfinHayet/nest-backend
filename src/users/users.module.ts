// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';    
import { UsersService } from './users.service';
import { UserRepository  } from './user.repository';
import { UsersController } from './users.controller';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PatientModule],
  providers: [UsersService,UserRepository],
  exports: [UsersService, UserRepository], 
  controllers: [UsersController],
})
export class UsersModule {}
