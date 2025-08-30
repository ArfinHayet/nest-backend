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
import { QuestionnaireService } from 'src/questioneer/questioneer.service';
import { AiSummaryService } from 'src/ai-summery/ai-summery.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
    constructor(private readonly submissionService: SubmissionService,
        private readonly assessmentService: AssessmentService,
        private readonly questionService: QuestionnaireService,
        private readonly aiSummery: AiSummaryService
    ) { }

    @Post()
    @Roles('admin', 'user')
    @ApiOperation({ summary: 'Create a new submission' })
    @ApiResponse({ status: 201, description: 'Submission created', type: Submission })
    async create(@Body() dto: any): Promise<Submission> {
        const existing = await this.assessmentService.findById(dto.assessmentId);

        // --- scoring rules ---
        const scoreIfAgree = new Set<number>([1, 7, 8, 10]);
        const scoreIfDisagree = new Set<number>([2, 3, 4, 5, 6, 9]);

        if (existing && existing.type === 'free') {
            let score = 0;

            for (let i = 0; i < dto.answers.length; i++) {
                const qNum = i + 1;
                const answerText = dto.answers[i].answer;

                if (
                    scoreIfAgree.has(qNum) &&
                    (answerText === 'Definitely agree' || answerText === 'Slightly agree')
                ) {
                    score++;
                }

                if (
                    scoreIfDisagree.has(qNum) &&
                    (answerText === 'Definitely disagree' || answerText === 'Slightly disagree')
                ) {
                    score++;
                }
            }

            dto.score = score;
        }

        if (dto.answers?.length > 0) {
            const dataSet = [];
            for (const ans of dto.answers) {
                const questionData = await this.questionService.findById(ans.questionId);
                if (questionData) {
                    dataSet.push({
                        question: questionData.questions,
                        answer: ans.answer,
                    });
                }
            }

            // generate summary
            const summary = await this.aiSummery.summarizeAll(dataSet);
            dto.summary = summary; // ✅ use consistent spelling
        }

        return this.submissionService.create(dto);
    }





    @Get()
    @Roles('admin', 'user')
    @ApiOperation({ summary: 'Get all submissions' })
    @ApiResponse({ status: 200, description: 'List of submissions', type: [Submission] })
    async findAll(@Query() query: Record<string, any>) {
        const submissions = await this.submissionService.findAll(query, true);
        return sendResponse(submissions, 'Submissions retrieved successfully', 200);
    }
}
