// user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from './availability.entity';
import { BaseRepository } from 'src/core/base.repository';

@Injectable()
export class AvailabilityRepository extends BaseRepository<Availability> {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
  ) {
    super(availabilityRepo);
  } 
}
