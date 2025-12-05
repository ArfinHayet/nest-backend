import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './entity/banner.entity';

import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Banners')
@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) { }

  // 🔹 Create Banner
  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new banner' })
  @ApiResponse({ status: 201, type: Banner })
  async create(@Body() dto: CreateBannerDto) {
    console.log('DTO:', dto);
    const banner = await this.bannerService.create(dto);
    return sendResponse(banner, 'Banner created successfully', 201);
  }
  // 🔹 Get All
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all banners' })
  @ApiResponse({ status: 200, type: [Banner] })
  async findAll(@Query() query: any) {
    const banners = await this.bannerService.findAll(query);

    if (!banners || banners.length === 0) {
      return sendResponse([], 'No banners found', 200);
    }

    return sendResponse(banners, 'Banners retrieved successfully', 200);
  }

  // 🔹 Get by ID
  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get banner by ID' })
  @ApiResponse({ status: 200, type: Banner })
  async findById(@Param('id') id: number) {
    const banner = await this.bannerService.findById(+id);
    return sendResponse(banner, 'Banner retrieved successfully', 200);
  }

  // 🔹 Update
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update banner' })
  @ApiResponse({ status: 200, type: Banner })
  async update(@Param('id') id: number, @Body() dto: UpdateBannerDto) {
    const banner = await this.bannerService.update(+id, dto);
    return sendResponse(banner, 'Banner updated successfully', 200);
  }


  // 🔹 Remove
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete banner' })
  @ApiResponse({ status: 200 })
  async remove(@Param('id') id: number) {
    await this.bannerService.remove(+id);
    return sendResponse(null, 'Banner deleted successfully', 200);
  }
}
