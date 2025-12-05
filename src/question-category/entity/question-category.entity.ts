// question-category.entity.ts
import { Assessment } from 'src/assessment/assessment.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class QuestionCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  variant: string; // Foreign key column

  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;


  @Column({ nullable: true })
  assessmentId: number; // Foreign key column
}
