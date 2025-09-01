import { Controller, Post, Get, Body, Query, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Leave } from './dto/leave.entity';
import { sendResponse } from 'src/utils/send-response';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Leaves')
@Controller('leaves')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Create a new leave' })
  @ApiResponse({ status: 201, description: 'Leave created', type: Leave })
  async create(@Body() dto: CreateLeaveDto): Promise<object> {
    const leaves = await this.leaveService.create(dto);
    return sendResponse(leaves, 'Leave created successfully', 201);
  }

  @Put(':id')
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Update an existing leave' })
  @ApiResponse({ status: 200, description: 'Leave updated', type: Leave })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateLeaveDto,
  ): Promise<object> {
    try {
      const leaves = await this.leaveService.updateLeave(id, dto);
      return sendResponse(leaves, 'Leave updated successfully', 200);
    } catch (err) {
      throw new BadRequestException(err.message || 'Failed to update leave');
    }
  }

  @Get()
  @Roles('admin', 'user', 'clinician')
  @ApiOperation({ summary: 'Get all leaves' })
  @ApiResponse({ status: 200, description: 'List of leaves', type: [Leave] })
  async findAll(@Query() query: Record<string, any>) {
    const leaves = await this.leaveService.findAll(query, true);
    return sendResponse(leaves, 'Leaves retrieved successfully', 200);
  }

}
