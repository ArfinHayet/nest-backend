import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PatientAppointmentService } from './patient-appointment.service';
import { CreatePatientAppointmentDto } from './dto/create-patient-appointment.dto';
import { UpdatePatientAppointmentDto } from './dto/update-patient-appointment.dto';
import { PatientAppointment } from './entity/patient-appointment.entity';

import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Patient Appointments')
@Controller('patient-appointments')
export class PatientAppointmentController {
  constructor(
    private readonly patientAppointmentService: PatientAppointmentService,
  ) {}

  // 🔹 Create appointment
  @Post()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Create a new patient appointment' })
  @ApiResponse({ status: 201, description: 'Patient appointment created', type: PatientAppointment })
  async create(@Body() createDto: CreatePatientAppointmentDto) {
    const result = await this.patientAppointmentService.create(createDto);
    return sendResponse(result, 'Patient appointment created successfully', 201);
  }

  // 🔹 Get all appointments
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all patient appointments' })
  @ApiResponse({ status: 200, description: 'List of patient appointments', type: [PatientAppointment] })
  async findAll(@Query() query: any) {
    const result = await this.patientAppointmentService.findAll(query);

    if (!result || result.length === 0) {
      return sendResponse([], 'No patient appointments found', 200);
    }

    return sendResponse(result, 'Patient appointments retrieved successfully', 200);
  }

  // 🔹 Get appointment by ID
  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get patient appointment by ID' })
  @ApiResponse({ status: 200, description: 'Patient appointment retrieved', type: PatientAppointment })
  async findById(@Param('id') id: number) {
    const result = await this.patientAppointmentService.findById(+id);
    return sendResponse(result, 'Patient appointment retrieved successfully', 200);
  }

  // 🔹 Update appointment
  @Patch(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Update a patient appointment' })
  @ApiResponse({ status: 200, description: 'Patient appointment updated', type: PatientAppointment })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdatePatientAppointmentDto,
  ) {
    const result = await this.patientAppointmentService.update(+id, updateDto);
    return sendResponse(result, 'Patient appointment updated successfully', 200);
  }

  // 🔹 Get by patient ID
  @Get('patient/:patientId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get appointments by patient ID' })
  @ApiResponse({ status: 200, type: [PatientAppointment] })
  async findByPatient(@Param('patientId') patientId: number) {
    const result = await this.patientAppointmentService.findByPatient(+patientId);
    return sendResponse(result, 'Patient appointments for this patient retrieved', 200);
  }

  // 🔹 Get by clinician ID
  @Get('clinician/:clinicianId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get appointments by clinician ID' })
  @ApiResponse({ status: 200, type: [PatientAppointment] })
  async findByClinician(@Param('clinicianId') clinicianId: number) {
    const result = await this.patientAppointmentService.findByClinician(+clinicianId);
    return sendResponse(result, 'Patient appointments for this clinician retrieved', 200);
  }

  // 🔹 Get by user ID
  @Get('user/:userId')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get appointments by user ID' })
  @ApiResponse({ status: 200, type: [PatientAppointment] })
  async findByUser(@Param('userId') userId: number) {
    const result = await this.patientAppointmentService.findByUser(+userId);
    return sendResponse(result, 'Patient appointments for this user retrieved', 200);
  }
}
