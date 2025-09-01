import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave } from './leave.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class LeaveRepository extends BaseRepository<Leave> {
  constructor(
    @InjectRepository(Leave)
    private readonly leaveRepo: Repository<Leave>,
  ) {
    super(leaveRepo);
  }


}
