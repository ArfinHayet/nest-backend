import { Controller, Post, Get, Body, Put, Param, ParseIntPipe } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuestionnaireService } from '../questioneer/questioneer.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { Questionnaire } from '../questioneer/questioneer.entity';
import { sendResponse } from 'src/utils/send-response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { Query } from '@nestjs/common';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Questionnaires')
@Controller('questionnaires')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) { }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new questionnaire' })
  @ApiResponse({ status: 201, description: 'Questionnaire created successfully', type: Questionnaire })
  async create(@Body() dto: CreateQuestionnaireDto) {
    const questions = await this.questionnaireService.create(dto);
    return sendResponse(questions, "Questionnaire created successfully", 201)
  }


  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a questionnaire' })
  @ApiResponse({ status: 201, description: 'Questionnaire Updated successfully', type: Questionnaire })
  async update(
    @Param('id', ParseIntPipe) id: number, // <-- add ParseIntPipe
    @Body() dto: UpdateQuestionnaireDto,
  ) {
    const questions = await this.questionnaireService.update(id, dto);
    return sendResponse(questions, "Questionnaire updated successfully", 201)
  }


  @Get()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get all questionnaires' })
  @ApiResponse({ status: 200, description: 'List of questionnaires', type: [Questionnaire] })
  async findAll(@Query() query: Record<string, any>) {
    const questions = await this.questionnaireService.findAll(query);
    return sendResponse(questions, 'questions retrieved successfully', 201)
  }


  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a questionnaire' })
  @ApiResponse({ status: 200, description: 'Questionnaire deleted successfully' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.questionnaireService.delete(id);
    return sendResponse(null, `Questionnaire with id ${id} deleted successfully`, 200);
  }
}
