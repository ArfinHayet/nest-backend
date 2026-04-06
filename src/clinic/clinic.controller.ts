import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { sendResponse } from 'src/utils/send-response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiParam } from '@nestjs/swagger';
import { ParseIntPipe } from '@nestjs/common';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Roles('admin')
  @Post('create')
  async create(
    @Body('clinic') clinicDto: CreateClinicDto,
    @Body('user') userDto: CreateUserDto,
  ) {
    const clinic = await this.clinicService.create(clinicDto, userDto);
    return sendResponse(clinic, 'Clinic registered successfully', 201);
  }

  @Roles('admin')
    @Get()
async findAll(@Query() query: Record<string, any>) {
  const clinics = await this.clinicService.findAll(query);
   return sendResponse(clinics, 'Clinics retrieved successfully', 200);
  }

  @Roles('admin', 'clinic')
  @Get(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const clinic = await this.clinicService.findById(id);
    return sendResponse(clinic, 'Clinic retrieved successfully', 200);
  }

  @Roles('admin', 'clinic')
  @Put(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    //   @Body() data: Partial<CreateClinicDto>,
    @Body() data: UpdateClinicDto,
  ) {
    const clinic = await this.clinicService.update(id, data);
    return sendResponse(clinic, 'Clinic updated successfully', 200);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number, description: 'Clinic ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clinicService.remove(id);
    return sendResponse(null, 'Clinic deleted successfully', 200);
  }
}
