import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './patient.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Patients')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient successfully created', type: Patient })
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientService.create(createPatientDto);
    return sendResponse(patient, 'Patient created successfully', 201)
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients', type: [Patient] })
  async findAll() {
    const patient = await this.patientService.findAll();
    return sendResponse(patient,'Patient retrieved successfully',200)
  }
}
