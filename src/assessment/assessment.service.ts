import { Injectable } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { AssessmentRepository } from './assessment.repository';
import { Assessment } from './assessment.entity';
import { BadRequestException } from '@nestjs/common';
import { Questionnaire } from 'src/questioneer/questioneer.entity';
import { PaymentService } from 'src/payment/payment.service';
@Injectable()
export class AssessmentService {
  constructor(
    private assessmentRepository: AssessmentRepository,
    private paymentService: PaymentService
  ) { }

  async create(dto: CreateAssessmentDto): Promise<Assessment> {
    if (dto.type === 'free') {
      const existingFree = await this.assessmentRepository.findByField('type', 'free');
      if (existingFree) {
        throw new BadRequestException('Only one free assessment is allowed');
      }
    }

    return this.assessmentRepository.create(dto);
  }

  async findAll(query) {
    // 1️⃣ Fetch assessments with their questionnaire relation
    const assessments = await this.assessmentRepository.findByJoin(
      Questionnaire,
      'questionnaire',
      'entity.id = questionnaire.assessmentId',
      query
    );

    // 2️⃣ Enrich each assessment with Stripe info using your service
    const enriched = await Promise.all(
      assessments.map(async (assessment) => {
        let stripeInfo = null;

        if (assessment.priceId) {
          try {
            // Call your service instead of hardcoding
            stripeInfo = await this.paymentService.getProductByPriceId(assessment.priceId);
          } catch (err) {
            console.error(
              `Stripe lookup failed for priceId ${assessment.priceId}`,
              err.message
            );
          }
        }

        return { ...assessment, stripeInfo };
      })
    );

    return enriched;
  }

  
  async findCount(query){
    return this.assessmentRepository.findCount(query);
  }

  async findById(id: number) {
    return this.assessmentRepository.findById(id)
  }

  async delete(id: number): Promise<void> {
    return this.assessmentRepository.deleteById(id);
  }

  async update(id: number, dto: Partial<CreateAssessmentDto>): Promise<Assessment> {
    return this.assessmentRepository.update(id, dto);
  }

}
