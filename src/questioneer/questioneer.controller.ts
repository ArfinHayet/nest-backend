import { Controller, Post, Get, Body, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { QuestionnaireService } from '../questioneer/questioneer.service';
import { AnswerType, CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { Questionnaire } from '../questioneer/questioneer.entity';
import { sendResponse } from 'src/utils/send-response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';
import { Readable } from 'stream';
import csv from 'csv-parser';


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
    console.log(dto)
    const questions = await this.questionnaireService.create(dto);
    return sendResponse(questions, "Questionnaire created successfully", 201)
  }



  @Post('bulk-upload')
  @Roles('admin')
  @ApiOperation({ summary: 'Bulk upload questionnaires using CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Questionnaires created successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    const dtos: CreateQuestionnaireDto[] = [];

    // 1️⃣ Parse CSV
    await new Promise<void>((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (row) => {
           // Parse options with scores
        let optionsWithScores = undefined;
        
        if (row.options) {
          try {
            // CSV format: "Yes:1|No:0"
            optionsWithScores = row.options
              .split('|')
              .map((opt: string) => {
                const [label, score] = opt.trim().split(':');
                return {
                  label: label.trim(),
                  score: parseFloat(score || '0'),
                };
              });
          } catch (err) {
            console.error('Failed to parse options:', err);
          }
        }
          dtos.push({
            assessmentId: Number(row.assessmentId),
            questions: row.questions,
            order: Number(row.order),
            answerType: row.answerType as AnswerType,
            // options: row.options
            //   ? row.options.split('|').map((o: string) => o.trim())
            //   : undefined,
                      options: optionsWithScores, 

            questiontypeid: row.questiontypeid
              ? Number(row.questiontypeid)
              : undefined,
            variant: row.variant || undefined,
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // 2️⃣ Loop & call existing create() service
    const createdQuestions = [];

    for (const dto of dtos) {
      console.log('Creating questionnaire:', dto);
      const question = await this.questionnaireService.create(dto);
      createdQuestions.push(question);
    }

    return sendResponse(
      createdQuestions,
      'Questionnaires created successfully',
      201,
    );
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


