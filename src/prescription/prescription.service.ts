import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PrescriptionRepository } from './dto/prescription.repository';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './dto/prescription.entity';

@Injectable()
export class PrescriptionService {
  constructor(
    private readonly prescriptionRepository: PrescriptionRepository,
    private readonly dataSource: DataSource,
  ) {}

  // ✅ Create a new prescription
  async create(dto: CreatePrescriptionDto): Promise<Prescription> {
    return await this.dataSource.transaction(async (manager) => {
      const prescription = manager.create(Prescription, {
        assessmentId: dto.assessmentId,
        userId: dto.userId,
        patientId: dto.patientId,
        observation: dto.observation,
        medicine: dto.medicine,
        dosage: dto.dosage,
        frequency: dto.frequency,
        duration: dto.duration,
      });
      await manager.save(prescription);
      return prescription;
    });
  }

  // ✅ Get all prescriptions (with optional filters)
  async findAll(query: Record<string, any>, includeRelations: boolean): Promise<Prescription[]> {
    return this.prescriptionRepository.findAll(query as any, includeRelations);
  }


  // ✅ Update prescription
  async updatePrescription(id: number, dto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.prescriptionRepository.findById(id);
    if (!prescription) {
      throw new BadRequestException('Prescription not found');
    }
    Object.assign(prescription, dto);
    return this.prescriptionRepository.create(prescription);
  }
}
