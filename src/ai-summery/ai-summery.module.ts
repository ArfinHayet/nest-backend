import { Module } from '@nestjs/common';
import { AiSummaryService } from './ai-summery.service';

@Module({
  providers: [AiSummaryService],
  exports:[AiSummaryService]
})
export class AiSummeryModule {}
