import { Controller, Get, Post, Body, Param, Query, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { sendResponse } from 'src/utils/send-response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiParam } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';
import { PatientService } from 'src/patient/patient.service';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private patientService: PatientService) { }

  @Roles('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return sendResponse(user, 'User created successfully', 201)
  }
  @Roles('admin', 'clinic')
  @Get()
  async findAll(@Query() query: Record<string, any>) {
    const users = await this.usersService.findAll(query);
    return sendResponse(users, 'User retrieved successfully', 201)
  }


  @Roles('admin', 'user', 'clinic')
  @Get(':id/') // ✅ Define path properly
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async findById(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    const patient = await this.usersService.findById(userId)
    return sendResponse(patient, 'User retrieved successfully', 201)
  }

  @Roles('admin', 'user', 'clinic')
  @Get(':id/patients') // ✅ Define path properly
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async getPatientsByUser(
    @Param('id', ParseIntPipe) userId: number,
  ) {
    const patient = await this.patientService.findPatientsByUser(userId);
    return sendResponse(patient, 'Patient retrieved successfully', 201)
  }


  // ✅ Update user endpoint
  @Roles('admin', 'user', 'clinician', 'clinic')
  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async update(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(userId, updateUserDto);
    return sendResponse(updatedUser, 'User updated successfully', 200);
  }


  // ✅ Delete user endpoint
  @Roles('admin')
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  async remove(@Param('id', ParseIntPipe) userId: number) {
    await this.usersService.remove(userId);
    return sendResponse(null, 'User deleted successfully', 200);
  }

}
