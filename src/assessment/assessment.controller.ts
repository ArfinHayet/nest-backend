import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { Assessment } from './assessment.entity';
import { sendResponse } from 'src/utils/send-response';

@ApiTags('Assessments')
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new assessment' })
  @ApiResponse({ status: 201, description: 'Assessment created', type: Assessment })
  async create(@Body() dto: CreateAssessmentDto) {
    const assessment = await this.assessmentService.create(dto);
    return sendResponse(assessment,'assessment created successfully',201) 
  }
 
  @Get() 
  @ApiOperation({ summary: 'Get all assessments' })
  @ApiResponse({ status: 200, description: 'List of assessments', type: [Assessment] })
  async findAll() {
    const assessments = await this.assessmentService.findAll();
    return sendResponse(assessments,'assessments retrieved successfully',200)
  }
}
