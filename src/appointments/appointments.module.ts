import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './entity/appointments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from './entity/appointments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments])],
  providers: [AppointmentsService, AppointmentsRepository], // 👈 register here
  controllers: [AppointmentsController],
  exports: [AppointmentsRepository, AppointmentsService],
})
export class AppointmentsModule {}
