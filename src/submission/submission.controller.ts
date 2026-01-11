import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Patch,
  Param,
  Put,
  Delete,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { Submission } from './entity/submission.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AssessmentService } from 'src/assessment/assessment.service';
import { QuestionnaireService } from 'src/questioneer/questioneer.service';
import { AiSummaryService } from 'src/ai-summery/ai-summery.service';
import { PaymentService } from 'src/payment/payment.service';
import { AnswerService } from 'src/questioneer/answer/answer.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/public/public.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(
    private readonly submissionService: SubmissionService,
    private readonly assessmentService: AssessmentService,
    private readonly questionService: QuestionnaireService,
    private readonly aiSummery: AiSummaryService,
    private readonly paymentService: PaymentService,
    private readonly answerService: AnswerService,
    private readonly usersService: UsersService
  ) { }
  @Post()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Create a new submission' })
  @ApiResponse({
    status: 201,
    description: 'Submission created',
    type: Submission,
  })
  async create(@Body() dto: any): Promise<Submission> {
    const existing = await this.assessmentService.findById(dto.assessmentId);
    if (!existing) {
      throw new BadRequestException('Invalid assessmentId');
    }

    // ----------------------------------------
    // ⭐ AUTO-ASSIGN CLINICIAN (LEAST LOADED)
    // ----------------------------------------
    const clinicians = await this.usersService.findAll({ role: 'clinician' });

    if (!clinicians || clinicians.length === 0) {
      throw new BadRequestException('No clinicians available');
    }

    // calculate submission load for each clinician
    const clinicianLoad = [];

    for (const c of clinicians) {
      const count = await this.submissionService.countByClinicianId(c.id);
      clinicianLoad.push({ id: c.id, count });
    }

    // pick clinician with lowest submission count
    clinicianLoad.sort((a, b) => a.count - b.count);

    const selectedClinician = clinicianLoad[0];
    dto.clinicianId = selectedClinician.id;

    // -----------------------------
    // ⭐ Flutter-Style Scoring Logic
    // -----------------------------
    // if (dto.answers?.length > 0) {
    //   const optionScore: Record<string, number> = {
    //     "Never": 0,
    //     "Rarely": 1,
    //     "Sometimes": 2,
    //     "Often": 3,
    //     "Very Often": 4,
    //   };

    //   let totalScore = 0;

    //   for (const ans of dto.answers) {
    //     const score = optionScore[ans.answer] ?? 0;
    //     totalScore += score;
    //   }

    //   const totalPossibleScore = dto.answers.length * 4;

    //   dto.score = totalScore;
    //   dto.possible_score = totalPossibleScore;

    //   dto.passed = totalScore > 42 ? true : false;
    // }


     // -------------------------------------------------------
    // ⭐ NEW SCORING LOGIC: Calculate score from options
    // -------------------------------------------------------
  if (dto.answers?.length > 0) {
    let totalScore = 0;
    let totalPossibleScore = 0;

    for (const ans of dto.answers) {
      // Fetch question to get options with scores
      const questionData = await this.questionService.findById(ans.questionId);

      if (questionData && questionData.options) {
        // Find the selected option by matching answer label
        const selectedOption = questionData.options.find(
          (opt) => opt.label === ans.answer
        );

        if (selectedOption) {
          totalScore += Number(selectedOption.score);
          ans.score = Number(selectedOption.score); // Save score in answer
        } else {
          console.warn(`No matching option found for answer: "${ans.answer}" in question ${ans.questionId}`);
          ans.score = 0;
        }

        // Calculate max possible score for this question
        const maxScore = Math.max(...questionData.options.map(opt => Number(opt.score)));
        totalPossibleScore += maxScore;
      }
    }

    dto.score = totalScore;
    dto.possible_score = totalPossibleScore;

    // Calculate percentage and set status
    const percentage = totalPossibleScore > 0 
      ? (totalScore / totalPossibleScore) * 100 
      : 0;

    // If score >= 40% → status2 = "false", else "true"
    dto.status2 = percentage >= 40 ? 'false' : 'true';
  }

    // -------------------------------------------------------
    // ⭐ Premium Assessment: Build dataset + AI summary logic
    // -------------------------------------------------------
    if (dto.answers?.length > 0 && existing.type === 'premium') {
      const dataSet = [];

      for (const ans of dto.answers) {
        const questionData = await this.questionService.findById(ans.questionId);

        if (questionData) {
          dataSet.push({
            question: questionData.questions,
            answer: ans.answer,
             score: ans.score || 0,
          });
        }
      }

      const priceInfo = await this.paymentService.getPriceById(existing.priceId);
      dto.paidAmount = priceInfo ? priceInfo.unit_amount.toString() : '0';

      // generate AI summary
      try {
        const summary = await this.aiSummery.summarizeAll(dataSet);
        dto.summary = summary;
      } catch (err) {
        dto.summary = '';
        console.error('AI summary generation failed:', err.message);
      }
    }

    // -------------------------------
    // ⭐ Default non-premium fields
    // -------------------------------
    dto.status = 'pending';
    dto.ratings = 0;
    dto.additionalInfo = '';

    // -------------------------------
    // ⭐ Create Submission
    // -------------------------------
    try {
      return this.submissionService.create(dto);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(
        err.message || 'Failed to create submission',
      );
    }
  }


  @Put(':id')
  @Public()
  @ApiOperation({ summary: 'Update an existing submission' })
  @ApiResponse({ status: 200, description: 'Submission updated', type: Submission })
  async update(
    @Param('id') id: number,
    @Body() dto: Partial<CreateSubmissionDto>,
  ): Promise<Submission> {
    try {
      const updated = await this.submissionService.updateAssessment(id, dto);
      return updated;
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to update submission');
    }
  }

  @Get()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Get all submissions' })
  @ApiResponse({ status: 200, description: 'List of submissions', type: [Submission] })
  async findAll(@Query() query: Record<string, any>) {
    const submissions = await this.submissionService.findAll(query, true);
    return sendResponse(submissions, 'Submissions retrieved successfully', 200);
  }

  // 🗑️ NEW ENDPOINT: Remove all submissions & answers for a specific assessment
  @Delete(':id')
  @Roles('admin', 'clinician')
  @ApiOperation({ summary: 'Remove all submissions by assessment ID' })
  @ApiResponse({ status: 200, description: 'All submissions deleted for the given assessment' })
  async remove(@Param('id') id: number) {
    try {
      const result = await this.submissionService.deleteAssessment(id);
      await this.answerService.removeByAssessmentId(id);
      return sendResponse(result, 'Assessment submissions deleted successfully', 200);
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to delete assessment submissions');
    }
  }
}
