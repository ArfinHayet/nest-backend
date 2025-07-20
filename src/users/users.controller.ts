import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { sendResponse } from 'src/utils/send-response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto.name, createUserDto.email);
    return sendResponse(user,'User created successfully',201)
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return sendResponse(users,'User retrieved successfully',201)
  }

}
