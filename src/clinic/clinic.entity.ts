import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clinicName: string;

  @Column()
  clinicType: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @Column()
  phone: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
