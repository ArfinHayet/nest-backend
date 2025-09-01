import { Controller, Post, Get, Body, Query, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './dto/prescription.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Prescriptions')
@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Create a new prescription' })
  @ApiResponse({ status: 201, description: 'Prescription created', type: Prescription })
  async create(@Body() dto: CreatePrescriptionDto): Promise<object> {
    const prescriptions = await this.prescriptionService.create(dto);
    return sendResponse(prescriptions, 'Prescriptions retrieved successfully', 200);
  }

  @Put(':id')
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Update an existing prescription' })
  @ApiResponse({ status: 200, description: 'Prescription updated', type: Prescription })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    try {
      const updated = await this.prescriptionService.updatePrescription(id, dto);
      return updated;
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to update prescription');
    }
  }

  @Get()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Get all prescriptions' })
  @ApiResponse({ status: 200, description: 'List of prescriptions', type: [Prescription] })
  async findAll(@Query() query: Record<string, any>) {
    const prescriptions = await this.prescriptionService.findAll(query, true);
    return sendResponse(prescriptions, 'Prescriptions retrieved successfully', 200);
  }
}
