import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_sessions')
export class PaymentSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // Link to your User table (if you have one)

  @Column({ unique: true })
  sessionId: string; // Stripe checkout.session.id

  @Column({ type: 'varchar', length: 50 })
  paymentStatus: string; // e.g., "paid", "unpaid", "pending"

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
