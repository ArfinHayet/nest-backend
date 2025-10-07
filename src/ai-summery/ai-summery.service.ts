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
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    console.log("Data set",qaList)
    let combined = qaList
      .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
      .join('\n\n');

    const prompt = `Act as a clinical documentation specialist and synthesize the patient's self-reported medical and developmental history, gathered through the detailed questionnaire below, into a formal, structured Decision Support Report (DSR). This report is intended to aid an experienced clinician in the diagnostic process for adult ADHD and to identify critical safety or comorbidity concerns.
    The output must strictly adhere to the following five-part structure and analytical requirements, using the provided questionnaire data as the sole source of evidence:
    Decision Support Report: Medical and Developmental History Summary
    I. Diagnostic Mapping: Onset, Pervasiveness, and Chronicity
    Analyze the responses across all categories to establish the core DSM-5 requirements for ADHD.
    Childhood Onset (Pre-12): Provide a direct, synthesized statement confirming or questioning the presence of persistent, impairing symptoms prior to age 12 (using data from Item 2.5 and supported by early developmental notes in Items 1.2, 1.4, 2.2). Cite 1-2 concrete, anonymized examples of childhood impairment (e.g., 'Reports difficulty with seating in Primary School').
    Pervasiveness (Multiple Settings): List the specific current life settings (extracted from Item 3.4) where the patient currently reports significant, documented impairment (e.g., Work, Home/Finance, Social).
    Chronicity: Summarize evidence from Items 2.2, 2.3, 2.4, and 3.1 that suggests the symptoms have been chronic (lifelong) rather than recent-onset.
    II. Core Symptom Manifestation Profile
    Synthesize the patient's narrative across the entire lifespan (Categories 1, 2, and 3) and summarize the core symptom presentation.
    Inattention Profile: Identify chronic themes of struggle related to organization, follow-through, task initiation/completion, and independent study (Items 2.3, 2.4, 3.2).
    Hyperactivity/Impulsivity Profile: Identify chronic themes of intensity, restlessness, emotional reactivity (affective lability), relationship conflict, and rapid decision-making/changes (Items 1.4, 3.1, 3.3).
    Developmental Context: Provide a brief summary of formal concerns and outcomes (Item 2.7) and how the patient views their challenges compared to peers (Item 2.6).
    III. Functional Impairment in Adulthood
    Summarize the impact of symptoms on current adult functioning and self-perception, translating the patient's free-form text into clinical observations.
    Occupational Stability & Performance: Detail patterns of frequent job changes, reasons for changes, and specific current challenges in managing workload or interacting with colleagues (Items 3.1, 3.2).
    Interpersonal & Relationship Functioning: Summarize the reported patterns in romantic/social relationships and the specific ways core symptoms are reported to impact those relationships (Item 3.3).
    Internal Locus of Struggle: State the patient's own explanation for their struggles (lack of effort/motivation vs. executive dysfunction/inability to execute, per item 3.5).
    IV. Critical Medical and Psychiatric Flags
    Extract and flag all relevant information from Category 4 for risk mitigation, differential diagnosis, and treatment planning.
    Current Medication List: List all current medications, prescribed and otherwise, including dosage where provided (Item 4.4).
    Cardiac Risk Screening: FLAG BOLDLY any reported history of personal chronic heart conditions (e.g., palpitations, high BP) or any family history of sudden cardiac death/arrhythmias (Items 4.1, 4.5).
    Psychiatric Comorbidity: List all confirmed or suspected co-occurring mental health and neurodevelopmental conditions (e.g., Depression, Anxiety, Autism, Dyslexia) in both the patient and immediate family (Items 4.2, 4.3, 4.7).
    Early Medical History: Note any significant pregnancy/birth complications, early illnesses, or head injuries (Items 1.1, 4.6).
    V. Preliminary Clinical Summary & Hypothesis
    Based only on the documented historical evidence:
    Hypothesis Strength: State whether the historical evidence strongly, moderately, or weakly suggests a pattern consistent with ADHD, noting whether the pattern appears to lean predominantly towards inattentive, hyperactive/impulsive, or combined presentation.
    Differential Considerations: List 2-3 specific potential non-ADHD or co-occurring differential diagnoses (e.g., Bipolar II, GAD, Major Depressive Disorder, Traumatic Stress Reaction) that should be explored given the patient's reported symptom profile, intensity/reactivity, and comorbidity history.
    Contextual Note: Provide a brief, objective note regarding the intersection of the patient's struggles and their identity or social context, if addressed (Item 5.1)."

    Here are several quiz questions with their answers. 
    Create a **Decision Support Report (DSR)**.

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
