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
}
