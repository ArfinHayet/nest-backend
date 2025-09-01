import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Blog } from './repository/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { sendResponse } from 'src/utils/send-response';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({ status: 201, description: 'Blog created', type: Blog })
  async create(@Body() dto: CreateBlogDto) {
    const blog = await this.blogService.create(dto);
    return sendResponse(blog, 'Blog created successfully', 201);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blogs' })
  @ApiResponse({ status: 200, description: 'Blogs retrieved', type: [Blog] })
  async findAll() {
    const blogs = await this.blogService.findAll();
    return sendResponse(blogs, 'Blogs retrieved successfully', 200);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog retrieved', type: Blog })
  async findOne(@Param('id') id: number) {
    const blog = await this.blogService.findOne(id);
    return sendResponse(blog, 'Blog retrieved successfully', 200);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog updated', type: Blog })
  async update(@Param('id') id: number, @Body() dto: UpdateBlogDto) {
    const blog = await this.blogService.update(id, dto);
    return sendResponse(blog, 'Blog updated successfully', 200);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog by ID' })
  @ApiResponse({ status: 200, description: 'Blog deleted' })
  async remove(@Param('id') id: number) {
    await this.blogService.remove(id);
    return sendResponse(null, 'Blog deleted successfully', 200);
  }
}
