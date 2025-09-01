import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('availabilities')
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({
    type: 'enum',
    enum: ['all_day', 'specific_day'],
  })
  availabilityType: 'all_day' | 'specific_day';

  @Column({ type: 'varchar', length: 20, nullable: true })
  day: string | null; // e.g. "Monday", "Tuesday" etc.

  @Column({ type: 'time', nullable: true })
  time: string | null; // e.g. "09:00:00"

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' } )
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
