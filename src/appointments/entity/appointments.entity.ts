import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from 'src/patient/patient.entity';

@Entity('appointments')
export class Appointments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column()
  userId: number;

  @Column()
  clinicianId: number;

  @Column({ type: 'timestamp' })
  time: Date;

  @Column({ nullable: true })
  link: string;

  // ✅ Relations
  @ManyToOne(() => Patient, (patient) => patient.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ nullable: true })
  meetingId: string;

  @Column({ nullable: true })
  meetingPassword: string;

  @Column({ nullable: true })
  displayName: string;


  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  notes_from_review: string;

  @Column({ type: 'text', nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  metting_status: string;

  @Column({ type: 'int', nullable: true })
  tries: number;
}
