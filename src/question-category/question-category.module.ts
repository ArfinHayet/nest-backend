// question-category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionCategoryController } from './question-category.controller';
import { QuestionCategoryService } from './question-category.service';
import { QuestionCategoryRepository } from './entity/question-category.repository';
import { QuestionCategory } from './entity/question-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionCategory])],
  controllers: [QuestionCategoryController],
  providers: [QuestionCategoryService, QuestionCategoryRepository],
  exports: [QuestionCategoryService, QuestionCategoryRepository],
})
export class QuestionCategoryModule {}
