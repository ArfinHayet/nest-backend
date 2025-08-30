import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiSummaryService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  // Summarize a single Q&A
  async summarizeQuiz(question: string, answer: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    Create a short summary (1-2 sentences) of this quiz Q&A:

    Question: ${question}
    Answer: ${answer}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  // Summarize multiple Q&As together
  async summarizeAll(qaList: { question: string; answer: string }[]): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log("Data set",qaList)
    let combined = qaList
      .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
      .join('\n\n');

    const prompt = `
    Here are several quiz questions with their answers. 
    Create a **short summary** (3-5 sentences) that captures the key points overall.

    ${combined}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  // Summarize each Q&A separately
  async summarizeEach(qaList: { question: string; answer: string }[]): Promise<string[]> {
    const summaries: string[] = [];
    for (const qa of qaList) {
      const summary = await this.summarizeQuiz(qa.question, qa.answer);
      summaries.push(summary);
    }
    return summaries;
  }
}
