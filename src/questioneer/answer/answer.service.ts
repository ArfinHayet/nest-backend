import { Injectable } from '@nestjs/common';
import { AnswerRepository } from './entity/answer.repository';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { BadRequestException } from '@nestjs/common';
import { Answer } from './entity/answer.entity';

@Injectable()
export class AnswerService {
  constructor(private readonly answerRepository: AnswerRepository) { }

  async create(dto: CreateAnswerDto): Promise<Answer> {
    // 1️⃣ Check if an answer already exists for the same questionId
    const existingAnswer = await this.answerRepository.findByField('questionId', dto.questionId)

    if (existingAnswer) {
      throw new BadRequestException(
        `Answer already exists for questionId: ${dto.questionId}`
      );
    }
    return this.answerRepository.create(dto);
  }

// async create(dto: CreateAnswerDto): Promise<Answer> {
//   // Check if answer exists for this specific combination
//   const existingAnswers = await this.answerRepository.findByField('questionId', dto.questionId);
  
//   if (existingAnswers) {
//     // Check if it matches the same user, patient, and assessment
//     const isDuplicate = Array.isArray(existingAnswers) 
//       ? existingAnswers.some(ans => 
//           ans.userId === dto.userId && 
//           ans.patientId === dto.patientId && 
//           ans.assessmentId === dto.assessmentId
//         )
//       : (existingAnswers.userId === dto.userId && 
//          existingAnswers.patientId === dto.patientId && 
//          existingAnswers.assessmentId === dto.assessmentId);
    
//     if (isDuplicate) {
//       throw new BadRequestException(
//         `Answer already exists for this question in this assessment`
//       );
//     }
//   }
  
//   return this.answerRepository.create(dto);
// }

  async findAll(query: Record<string, any>, includeRelations = false) {
    return this.answerRepository.findAll(query, includeRelations);
  }


  async findById(id: number): Promise<Answer | null> {
    return this.answerRepository.findById(id);
  }

  async remove(id: number): Promise<void> {
    return this.answerRepository.deleteById(id);
  }


    async removeByAssessmentId(assessmentId: number): Promise<number> {
    return this.answerRepository.deleteByField('assessmentId', assessmentId);
  }
}
