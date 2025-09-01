import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionController } from './prescription.controller';
import { Prescription } from './dto/prescription.entity';
import { PrescriptionService } from './prescription.service';
import { PrescriptionRepository } from './dto/prescription.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Prescription])],
  controllers: [PrescriptionController],
  exports: [PrescriptionService, PrescriptionRepository],
  providers: [PrescriptionService, PrescriptionRepository]
})
export class PrescriptionModule {}
