import { Controller, Post, Get, Body, Query, Put, Param } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { Availability } from './dto/availability.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Availabilities')
@Controller('availabilities')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) { }
  @Post()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Create new availabilities' })
  @ApiResponse({ status: 201, description: 'Availabilities created', type: [Availability] })
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true })) dto: CreateAvailabilityDto[]
  ): Promise<object> {
    const dataSet = await Promise.all(dto.map(item => this.availabilityService.create(item)));
    return sendResponse(dataSet, 'Availabilities created successfully', 201);
  }



  @Put(':id')
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Update an existing availability' })
  @ApiResponse({ status: 200, description: 'Availability updated', type: Availability })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateAvailabilityDto,
  ): Promise<object> {
    try {
      const availabilities = await this.availabilityService.updateAvailability(id, dto);
      return sendResponse(availabilities, 'Availabilities retrieved successfully', 200);
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to update availability');
    }
  }

  @Get()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Get all availabilities' })
  @ApiResponse({ status: 200, description: 'List of availabilities', type: [Availability] })
  async findAll(@Query() query: Record<string, any>) {
    const availabilities = await this.availabilityService.findAll(query, true);
    return sendResponse(availabilities, 'Availabilities retrieved successfully', 200);
  }

}
