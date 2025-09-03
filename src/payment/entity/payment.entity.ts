import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Assessment } from 'src/assessment/assessment.entity';
import { Patient } from 'src/patient/patient.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  priceId: string;

  @Column()
  sessionId: string;

  @Column()
  customerEmail: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  paymentStatus: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ nullable: true })
  patientId: string; // Stripe checkout.session.id

  @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @Column({ nullable: true })
  assessmentId: string; // Stripe checkout.session.id

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
