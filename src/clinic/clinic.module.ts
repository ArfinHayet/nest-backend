import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './clinic.entity';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { UsersModule } from '../users/users.module';
import { ClinicRepository } from './clinic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic]), UsersModule],
  controllers: [ClinicController],
  providers: [ClinicService,ClinicRepository],
})
export class ClinicModule {}
