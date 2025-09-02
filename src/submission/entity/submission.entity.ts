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
import { IsInt } from 'class-validator';

@Entity()
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: number;

  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @Column()
  assessmentId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ type: 'int', nullable: true })
  score: number;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string; // new field: e.g., 'pending', 'completed'

  @Column({ type: 'float', nullable: true })
  ratings: number; // new field: numeric rating

  @Column({ type: 'text', nullable: true })
  additionalInfo: string; // new field: extra notes

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;


  @Column({ type: 'text', nullable: true })
  paidAmount: string;
}
