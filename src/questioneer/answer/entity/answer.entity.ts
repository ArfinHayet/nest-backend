import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Questionnaire } from 'src/questioneer/questioneer.entity';
import { User } from 'src/users/user.entity';
import { Patient } from 'src/patient/patient.entity';
import { Assessment } from 'src/assessment/assessment.entity';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Questionnaire, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'questionId' })
    question: Questionnaire;

    @Column()
    questionId: number; // Foreign key column

    @Column({ type: 'text' })
    answer: string;

    @Column({ type: 'int', default: 0 })
    score: number;


    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number; // Foreign key column


    @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patientId' })
    patient: Patient;


    @Column()
    patientId: number; // Foreign key column


    @ManyToOne(() => Assessment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'assessmentId' })
    assessment: Assessment;


    @Column()
    assessmentId: number; // Foreign key column
}
