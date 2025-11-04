import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assessment } from '../assessment/assessment.entity';
import { QuestionCategory } from 'src/question-category/entity/question-category.entity';

@Entity()
export class Questionnaire {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @Column()
  assessmentId: number; // Foreign key column

  @Column({ type: 'text' })
  questions: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: 0 })
  order: number;

  @Column('text', { array: true, nullable: true })
  options: string[];

  @Column({ type: 'text', nullable: true })
  answerType: string;

  // ✅ FIXED: Correct foreign key to QuestionCategory
  @ManyToOne(() => QuestionCategory, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'questiontypeid' }) // <-- FIXED this line
  questionType: QuestionCategory;

  @Column({ nullable: true })
  questiontypeid: number; // Foreign key column

  @Column({ nullable: true })
  variant: string; // Foreign key column
}
