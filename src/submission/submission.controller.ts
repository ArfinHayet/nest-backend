import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submission } from './entity/submission.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new submission' })
  @ApiResponse({ status: 201, description: 'Submission created', type: Submission })
  async create(@Body() dto: CreateSubmissionDto) {
    const submission = await this.submissionService.create(dto);
    return sendResponse(submission, 'Submission created successfully', 201);
  }

  @Get()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get all submissions' })
  @ApiResponse({ status: 200, description: 'List of submissions', type: [Submission] })
  async findAll(@Query() query: Record<string, any>) {
    const submissions = await this.submissionService.findAll(query);
    return sendResponse(submissions, 'Submissions retrieved successfully', 200);
  }
}
