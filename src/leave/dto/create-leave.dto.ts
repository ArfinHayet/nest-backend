import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { LeaveType, LeaveStatus } from './leave.entity';

export class CreateLeaveDto {
  @ApiProperty({ enum: LeaveType, description: 'Type of leave' })
  @IsEnum(LeaveType)
  @IsNotEmpty()
  leaveType: LeaveType;

  @ApiProperty({ example: '2025-09-10', description: 'Start date of leave' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2025-09-12', required: false, description: 'End date of leave (for multiple day)' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: ['pending', 'approved', 'rejected'], required: false })
  @IsEnum(LeaveStatus)
  @IsOptional()
  status?: LeaveStatus;
}
