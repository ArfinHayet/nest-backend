import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './patient.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Query } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Patients')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, description: 'Patient successfully created', type: Patient })
  async create(@Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientService.create(createPatientDto);
    return sendResponse(patient, 'Patient created successfully', 201);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients', type: [Patient] })
  async findAll(@Query() query: Record<string, any>) {
    const patient = await this.patientService.findAll(query);

    if(patient){
       await Promise.all(patient.map(async (p) => {
          
      }));
    }
    return sendResponse(patient, 'Patient retrieved successfully', 200);
  }

  @Put(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({ status: 200, description: 'Patient successfully updated', type: Patient })
  async update(@Param('id') id: string, @Body() updatePatientDto: Partial<CreatePatientDto>) {
    const patient = await this.patientService.update(+id, updatePatientDto);
    return sendResponse(patient, 'Patient updated successfully', 200);
  }
}
