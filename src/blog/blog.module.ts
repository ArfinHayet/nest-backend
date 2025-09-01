// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './repository/blog.entity';   
import { BlogService } from './blog.service';
import { BlogRepository } from './repository/blog.repository';
import { BlogController } from './blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog])],
  providers: [BlogService,BlogRepository],
  exports: [BlogService, BlogRepository], 
  controllers: [BlogController],
})
export class BlogModule {} 
