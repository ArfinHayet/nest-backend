import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ManyToOne } from 'typeorm';
import { JoinColumn } from 'typeorm';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  gender: string;

  @Column()
  relationshipToUser: string;

  @Column({ nullable: true })
  aboutGp: string;

  @Column({ nullable: true })
  profileTag: string;


  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: number;


  @Column({ nullable: true })
  image: string;


}
