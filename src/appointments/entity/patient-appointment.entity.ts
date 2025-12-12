import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from 'src/patient/patient.entity';
import { User } from 'src/users/user.entity';

@Entity('patient_appointments')
export class PatientAppointment {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 Foreign Keys
  @Column()
  userId: number;

  @Column()
  patientId: number;

  @Column()
  clinicianId: number;

  // 🔹 Basic Fields
  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ type: 'int', default: 0 })
  tries: number;

  // 🔹 Relations
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Patient, (patient) => patient.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @ManyToOne(() => User, (User) => User.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clinicianId' })
  clinician: User;

  @Column({ type: 'text', nullable: true })
  description: string;
}
