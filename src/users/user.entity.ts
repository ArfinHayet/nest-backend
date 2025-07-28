// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
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

    // Hash password before inserting
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Only hash if password was changed (important for updates)
    if (this.password && !this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
