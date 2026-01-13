import { Controller, Post, Get, Body, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { QuestionnaireService } from '../questioneer/questioneer.service';
import { AnswerType, CreateQuestionnaireDto, OptionWithScore } from './dto/create-questionnaire.dto';
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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Public } from 'src/public/public.decorator';


@UseGuards(JwtAuthGuard)
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

// csv format
// assessmentId,questions,order,answerType,options,questiontypeid,variant
// 1,"Do you exercise regularly?",1,MultipleChoice,"Yes:1|No:0",1,internal
// 2,"How many hours do you sleep?",2,Text,,2,internal
// 3,"Are you satisfied?",3,Yes/No,"Yes:1|No:0|Maybe:0.5",1,external

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
        // let optionsWithScores = undefined;
        
       // Parse options with scores
          let optionsWithScores: OptionWithScore[] | undefined = undefined;
          
          if (row.options && row.options.trim() !== '') {
            try {
              // CSV format: "Yes:1|No:0"
              optionsWithScores = row.options
                .split('|')
                .map((opt: string) => {
                  const parts = opt.trim().split(':');
                  
                  if (parts.length !== 2) {
                    throw new Error(`Invalid option format: ${opt}`);
                  }
                  
                  const label = parts[0].trim();
                  const scoreStr = parts[1].trim();
                  
                  if (!label) {
                    throw new Error('Option label cannot be empty');
                  }
                  
                  const score = parseFloat(scoreStr);
                  
                  if (isNaN(score)) {
                    throw new Error(`Invalid score value: ${scoreStr}`);
                  }
                  
                  return {
                    label,
                    score,
                  };
                });
            } catch (err) {
              console.error(`Failed to parse options for row:`, row);
              console.error('Error:', err.message);
              throw new BadRequestException(
                `Invalid options format in CSV. Expected format: "Label1:Score1|Label2:Score2". Error: ${err.message}`
              );
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

    
if (dtos.length === 0) {
      throw new BadRequestException('No valid data found in CSV file');
    }

    // 2️⃣ Loop & call existing create() service
    const createdQuestions = [];

    for (const dto of dtos) {
      console.log('Creating questionnaire:', dto);
      const question = await this.questionnaireService.create(dto);
      createdQuestions.push(question);
    }

    return sendResponse(
      createdQuestions,
 `${createdQuestions.length} Questionnaires created successfully`,
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
  @Public()
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


