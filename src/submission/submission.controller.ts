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
import { AssessmentService } from 'src/assessment/assessment.service';
import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
    constructor(private readonly submissionService: SubmissionService, private readonly assessmentService: AssessmentService) { }

    @Post()
    @Roles('admin','user')
    @ApiOperation({ summary: 'Create a new submission' })
    @ApiResponse({ status: 201, description: 'Submission created', type: Submission })
    async create(@Body() dto: CreateSubmissionDto): Promise<Submission> {
        // const existing = await this.submissionService.findByAssessment(dto.assessmentId);
        // if (existing) {
        //     throw new ConflictException(`Submission for assessmentId ${dto.assessmentId} already exists`);
        // }
        // If not, create a new submission
        return this.submissionService.create(dto);   
    }



    @Get()
    @Roles('admin', 'user')
    @ApiOperation({ summary: 'Get all submissions' })
    @ApiResponse({ status: 200, description: 'List of submissions', type: [Submission] })
    async findAll(@Query() query: Record<string, any>) {
        const submissions = await this.submissionService.findAll(query,true);
        return sendResponse(submissions, 'Submissions retrieved successfully', 200);
    }
}
