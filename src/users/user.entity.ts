// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  age: number;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  postCode: string;

  @Column()
  street: string;

  @Column()
  role: string;

  @Column()
  knowHow: string;
}
