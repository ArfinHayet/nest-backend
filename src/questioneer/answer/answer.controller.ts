  import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { sendResponse } from 'src/utils/send-response';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Answer } from './entity/answer.entity';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Answers')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Create a new answer' })
  @ApiResponse({ status: 201, description: 'Answer created successfully', type: Answer })
  async create(@Body() dto: CreateAnswerDto) {
    const answer = await this.answerService.create(dto);
    return sendResponse(answer, 'Answer created successfully', 201);
  }

//   @Put(':id')
//   @Roles('admin', 'user')
//   @ApiOperation({ summary: 'Update an answer' })
//   @ApiResponse({ status: 200, description: 'Answer updated successfully', type: Answer })
//   async update(
//     @Param('id', ParseIntPipe) id: number,
//     @Body() dto: UpdateAnswerDto,
//   ) {
//     const answer = await this.answerService.update(id, dto);
//     return sendResponse(answer, 'Answer updated successfully', 200);
//   }

  @Get()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get all answers' })
  @ApiResponse({ status: 200, description: 'List of answers', type: [Answer] })
  async findAll() {
    const answers = await this.answerService.findAll();
    return sendResponse(answers, 'Answers retrieved successfully', 200);
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get answer by ID' })
  @ApiResponse({ status: 200, description: 'Answer retrieved successfully', type: Answer })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const answer = await this.answerService.findById(id);
    return sendResponse(answer, 'Answer retrieved successfully', 200);
  }
}
