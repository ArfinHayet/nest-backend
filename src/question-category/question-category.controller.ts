// question-category.controller.ts
import { Controller, Post, Get, Body, Query, Put, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuestionCategoryService } from './question-category.service';
import { CreateQuestionCategoryDto } from './dto/create-question-category.dto';
import { UpdateQuestionCategoryDto } from './dto/update-question-category.dto';
import { QuestionCategory } from './entity/question-category.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Question Categories')
@Controller('question-categories')
export class QuestionCategoryController {
  constructor(private readonly questionCategoryService: QuestionCategoryService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new question category' })
  @ApiResponse({ status: 201, description: 'Question category created', type: QuestionCategory })
  async create(@Body() dto: CreateQuestionCategoryDto): Promise<object> {
    const category = await this.questionCategoryService.create(dto);
    return sendResponse(category, 'Question category created successfully', 201);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update an existing question category' })
  @ApiResponse({ status: 200, description: 'Question category updated', type: QuestionCategory })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateQuestionCategoryDto,
  ): Promise<object> {
    try {
      const category = await this.questionCategoryService.update(id, dto);
      return sendResponse(category, 'Question category updated successfully', 200);
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to update question category');
    }
  }

  @Get()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Get all question categories' })
  @ApiResponse({ status: 200, description: 'List of question categories', type: [QuestionCategory] })
  async findAll(@Query() query: Record<string, any>) {
    const categories = await this.questionCategoryService.findAll(query);
    return sendResponse(categories, 'Question categories retrieved successfully', 200);
  }
}
