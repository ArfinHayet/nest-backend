import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { sendResponse } from 'src/utils/send-response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiParam } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';
import { CreatePatientDto } from 'src/patient/dto/create-patient.dto';
import { Patient } from 'src/patient/patient.entity';
import { PatientService } from 'src/patient/patient.service';
 

@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private patientService : PatientService) {}
  
  @Roles('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return sendResponse(user,'User created successfully',201)
  }
  @Roles('admin')
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return sendResponse(users,'User retrieved successfully',201)
  }


  @Get()
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async getPatientsByUser(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    const patient = await this.patientService.findPatientsByUser(userId);
    return sendResponse(patient,'Patient retrieved successfully',201)
  }

}
