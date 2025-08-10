import { Module } from '@nestjs/common';
import { QuestionnaireService } from './questioneer.service';
import { QuestionnaireController } from './questioneer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnaire } from './questioneer.entity';
import { QuestionnaireRepository } from './questionnaire.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnaire])],
  providers: [QuestionnaireService,QuestionnaireRepository],
  exports: [QuestionnaireService,QuestionnaireRepository],
  controllers: [QuestionnaireController]
})
export class QuestioneerModule {}
