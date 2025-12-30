import { Controller, Post, Get, Body, Patch, Put } from '@nestjs/common';
import { Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { Assessment } from './assessment.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Query } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Assessments')
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) { }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new assessment' })
  @ApiResponse({ status: 201, description: 'Assessment created', type: Assessment })
  async create(@Body() dto: CreateAssessmentDto) {
    const assessment = await this.assessmentService.create(dto);
    return sendResponse(assessment, 'assessment created successfully', 201)
  }

  @Get()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Get all assessments' })
  @ApiResponse({ status: 200, description: 'List of assessments', type: [Assessment] })
  async findAll(@Query() query: Record<string, any>) {
    const assessments = await this.assessmentService.findAll(query);
    return sendResponse(assessments, 'assessments retrieved successfully', 200)
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete an assessment by ID' })
  @ApiResponse({ status: 200, description: 'Assessment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assessment not found' })
  async delete(@Param('id') id: number) {
    await this.assessmentService.delete(id);
    return sendResponse(null, 'Assessment deleted successfully', 200);
  }


  @Put(':id')
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Update an assessment by ID' })
  @ApiResponse({ status: 200, description: 'Assessment updated', type: Assessment })
  async update(@Param('id') id: number, @Body() dto: Partial<CreateAssessmentDto>) {
    const assessment = await this.assessmentService.update(+id, dto);
    return sendResponse(assessment, 'Assessment updated successfully', 200);
  }



  @Get('count')
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Get all assessments' })
  @ApiResponse({ status: 200, description: 'List of assessments', type: [Assessment] })
  async findCount(@Query() query: Record<string, any>) {
    const assessments = await this.assessmentService.findCount(query);
    return sendResponse(assessments, 'assessment count retrieved successfully', 200)
  }
}
