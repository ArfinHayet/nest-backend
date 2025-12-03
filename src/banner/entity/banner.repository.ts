import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/core/base.repository';
import { Banner } from './banner.entity';

@Injectable()
export class BannerRepository extends BaseRepository<Banner> {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
  ) {
    super(bannerRepo);
  }
}
