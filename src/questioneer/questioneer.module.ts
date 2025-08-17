import { Module } from '@nestjs/common';
import { QuestionnaireService } from './questioneer.service';
import { QuestionnaireController } from './questioneer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnaire } from './questioneer.entity';
import { QuestionnaireRepository } from './questionnaire.repository';
import { Answer } from './answer/entity/answer.entity';
import { AnswerService } from './answer/answer.service';
import { AnswerRepository } from './answer/entity/answer.repository';
import { AnswerController } from './answer/answer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnaire,Answer])],
  providers: [QuestionnaireService,QuestionnaireRepository, AnswerService, AnswerRepository],
  exports: [QuestionnaireService,QuestionnaireRepository,AnswerService, AnswerRepository],
  controllers: [QuestionnaireController,AnswerController]
})
export class QuestioneerModule {}
