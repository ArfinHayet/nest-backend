// banner.module.ts
import { Module } from '@nestjs/common';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { BannerRepository } from './entity/banner.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entity/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  controllers: [BannerController],
  providers: [BannerService, BannerRepository],
})
export class BannerModule {}
   