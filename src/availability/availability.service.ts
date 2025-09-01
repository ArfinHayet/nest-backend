import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AvailabilityRepository } from './dto/availability.repository';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { Availability } from './dto/availability.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly dataSource: DataSource,
  ) {}

  // ✅ Create new availability
  async create(dto: CreateAvailabilityDto): Promise<Availability> {
    return await this.dataSource.transaction(async (manager) => {
      const availability = manager.create(Availability, {
        availabilityType: dto.availabilityType,
        day: dto.day,
        time: dto.time,
        userId: dto.userId,
      });
      await manager.save(availability);
      return availability;
    });
  }

  // ✅ Get all availabilities (with optional filters)
  async findAll(query: Record<string, any>, includeRelations = false): Promise<Availability[]> {
    return this.availabilityRepository.findAll(query as any, includeRelations);
  }


  // ✅ Update availability
  async updateAvailability(id: number, dto: UpdateAvailabilityDto): Promise<Availability> {
    const availability = await this.availabilityRepository.findById(id);
    if (!availability) {
      throw new BadRequestException('Availability not found');
    }
    Object.assign(availability, dto);
    return this.availabilityRepository.create(availability);
  }
}
