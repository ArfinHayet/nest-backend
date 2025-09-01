// src/prescription/prescription.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Assessment } from 'src/assessment/assessment.entity';
import { User } from 'src/users/user.entity';
import { Patient } from 'src/patient/patient.entity';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: number;

  @Column({ type: 'text', nullable: true })
  observation: string;

  @Column({ type: 'varchar', length: 255 })
  medicine: string;

  @Column({ type: 'varchar', length: 100 })
  dosage: string;

  @Column({ type: 'varchar', length: 100 })
  frequency: string;

  @Column({ type: 'varchar', length: 100 })
  duration: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
