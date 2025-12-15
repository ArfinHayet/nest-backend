// src/users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

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

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  postCode: string;

  @Column({ nullable: true })
  street: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  knowHow: string;

  @Column({ nullable: true })
  hcpcTitle: string;

  @Column({ nullable: true })
  regNo: string;

  @Column({ nullable: true })
  practiceName: string;

  @Column({ nullable: true })
  certification: string;

  @Column({ nullable: true })
  firebaseUid: string;

  @Column({ nullable: true })
  image: string;

  // ✅ Automatically set on insert
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Hash password before inserting/updating
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
