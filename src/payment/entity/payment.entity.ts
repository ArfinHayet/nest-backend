import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  priceId: string;

  @Column()
  sessionId: string;

  @Column()
  customerEmail: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  paymentStatus: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
