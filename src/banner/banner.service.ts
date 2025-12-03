import { Injectable } from '@nestjs/common';
import { BannerRepository } from './entity/banner.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async create(dto: CreateBannerDto) {
    return this.bannerRepository.create(dto);
  }

  async findAll(query: any) {
    return this.bannerRepository.findAll(query as any, true);
  }

  async findById(id: number) {
    return this.bannerRepository.findById(id);
  }

  async update(id: number, dto: UpdateBannerDto) {
    return this.bannerRepository.update(id, dto);
  }
}
