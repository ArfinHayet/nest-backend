import { Injectable } from '@nestjs/common';
import { Clinic } from './clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { ClinicRepository } from './clinic.repository';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ClinicService {
  constructor(
    private clinicRepo: ClinicRepository,
    private usersService: UsersService,
  ) {}

  async create(clinicDto: CreateClinicDto, userDto: any) {
    const user = await this.usersService.create({
      name: userDto.name,
      email: userDto.email,
      password: userDto.password,
      role: 'clinic',
      identifier: userDto.email,
    });

    const clinic = this.clinicRepo.create({ ...clinicDto, userId: user.id });
    return clinic;
  }

  async findAll(query) {
    return this.clinicRepo.findAll(query);
  }

  async findById(id: number) {
    return this.clinicRepo.findById(id);
  }

  async update(id: number, updateData: Partial<Clinic>) {
    const clinic = await this.clinicRepo.findById(id);
    if (!clinic) {
      throw new NotFoundException(`Clinic with id ${id} not found`);
    }
    return this.clinicRepo.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    return this.clinicRepo.deleteById(id);
  }
}
