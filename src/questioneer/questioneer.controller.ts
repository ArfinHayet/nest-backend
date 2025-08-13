import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuestionnaireService } from '../questioneer/questioneer.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { Questionnaire } from '../questioneer/questioneer.entity';
import { sendResponse } from 'src/utils/send-response';   
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Questionnaires')
@Controller('questionnaires')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new questionnaire' })
  @ApiResponse({ status: 201, description: 'Questionnaire created successfully', type: Questionnaire })
  async create(@Body() dto: CreateQuestionnaireDto) {
    const questions = await this.questionnaireService.create(dto);
    return sendResponse(questions,"Questionnaire created successfully",201)
  }

  @Get()
  @ApiOperation({ summary: 'Get all questionnaires' })
  @ApiResponse({ status: 200, description: 'List of questionnaires', type: [Questionnaire] })
  async findAll() {
    const questions = await this.questionnaireService.findAll();
    return sendResponse(questions,'questions retrieved successfully',201)
  }
}
