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
import { AssessmentService } from 'src/assessment/assessment.service';
import { SubmissionService } from 'src/submission/submission.service';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Patients')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService, private readonly submissionService: SubmissionService) { }

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
    const patients = await this.patientService.findAll(query);

    if (!patients || patients.length === 0) {
      return sendResponse([], 'No patients found', 200);
    }

    const result = await Promise.all(
      patients.map(async (patient) => {
        const assessments = await this.submissionService.findByPatientId(patient.id);
        console.log('assessments', assessments);
        return {
          ...patient, // spread existing patient properties
          assessments: assessments || [], // attach assessments safely
        };
      }),
    );

    return sendResponse(result, 'Patients retrieved successfully', 200);
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
