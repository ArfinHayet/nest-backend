import { Controller, Post, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointments } from './entity/appointments.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly eventEmitter: EventEmitter2
) {}

  @Post()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment successfully created', type: Appointments })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    const appointment = await this.appointmentsService.create(createAppointmentDto);
    this.eventEmitter.emit('appointment.created', appointment);
    return sendResponse(appointment, 'Appointment created successfully', 201);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'List of appointments', type: [Appointments] })
  async findAll(@Query() query: Record<string, any>) {
    const appointments = await this.appointmentsService.findAll(query);

    if (!appointments || appointments.length === 0) {
      return sendResponse([], 'No appointments found', 200);
    }

    return sendResponse(appointments, 'Appointments retrieved successfully', 200);
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment retrieved successfully', type: Appointments })
  async findById(@Param('id') id: string) {
    const appointment = await this.appointmentsService.findById(+id);
    return sendResponse(appointment, 'Appointment retrieved successfully', 200);
  }

  @Put(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment successfully updated', type: Appointments })
  async update(@Param('id') id: string, @Body() updateAppointmentDto: Partial<CreateAppointmentDto>) {
    const appointment = await this.appointmentsService.update(+id, updateAppointmentDto);
    return sendResponse(appointment, 'Appointment updated successfully', 200);
  }
}