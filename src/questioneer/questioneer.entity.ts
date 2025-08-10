import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Assessment } from '../assessment/assessment.entity';

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
}
