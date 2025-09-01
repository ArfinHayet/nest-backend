import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LeaveRepository } from './dto/leave.repository';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Leave } from './dto/leave.entity';

@Injectable()
export class LeaveService {
  constructor(
    private readonly leaveRepository: LeaveRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateLeaveDto): Promise<Leave> {
    return await this.dataSource.transaction(async (manager) => {
      const leave = manager.create(Leave, {
        leaveType: dto.leaveType,
        startDate: dto.startDate,
        endDate: dto.endDate,
        userId: dto.userId,
        status: dto.status
      });
      await manager.save(leave);
      return leave;
    });
  }

  async findAll(query: Record<string, any>, includeRelations = false): Promise<Leave[]> {
    return this.leaveRepository.findAll(query as any, includeRelations);
  }



  async updateLeave(id: number, dto: UpdateLeaveDto): Promise<Leave> {
    const leave = await this.leaveRepository.findById(id);
    if (!leave) {
      throw new BadRequestException('Leave not found');
    }
    Object.assign(leave, dto);
    return this.leaveRepository.create(leave);
  }
}
