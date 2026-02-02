import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from 'src/patient/patient.entity';
import { Assessment } from 'src/assessment/assessment.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  // ------------------------
  // Patient Relation
  // ------------------------
  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: number;

  // ------------------------
  // Assessment Relation
  // ------------------------
  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @Column()
  assessmentId: number;

  // ------------------------
  // User who submitted (existing)
  // ------------------------
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  // ------------------------
  // Clinician = User Relation (NEW)
  // ------------------------
  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clinicianId' })
  clinician: User;

  @Column({ nullable: true })
  clinicianId: number;

  // ------------------------
  // Fields
  // ------------------------
  @Column({ type: 'int', nullable: true })
  score: number;

  @Column({ type: 'int', nullable: true })
  possible_score: number;

  @Column({ type: 'text', nullable: true })
  paid_status: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'float', nullable: true })
  ratings: number;

  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @Column({ type: 'text', nullable: true })
  paidAmount: string;

  @Column({ type: 'text', nullable: true })
  questionType: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'boolean', nullable: true })
  clinician_approved: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  isAutoAssigned: boolean;

  @Column({ type: 'text', nullable: true })
  reviewer_name: string;

  @Column({ type: 'text', nullable: true })
  reviewer_email: string;

  @Column({ type: 'text', nullable: true })
  reviewer_occupation: string;

  @Column({ type: 'text', nullable: true })
  reviewer_relation: string;

  @Column({ type: 'json', nullable: true })
  domainScores: Record<string, { score: number; possible: number }>;
}
