import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Payment } from './entity/payment.entity';
import { PaymentRepository } from './entity/payment.repository';
import { PaymentSessionRepository } from './entity/payment-session.repository';
import { PaymentSession } from './entity/payment-session.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly paymentSessionRepo: PaymentSessionRepository,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_KEY, {
      apiVersion: null,
    });
  }

  // Method to create a payment session
  async createCheckoutSession(priceId: string, assessmentId: string, patientId: string, userId: number) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://nest-backend-4z6f.onrender.com/success',
      cancel_url: 'https://nest-backend-4z6f.onrender.com/cancel',
    });

    // ✅ Save to DB with "pending" status
    const paymentSession: Partial<PaymentSession> = {
      userId,
      sessionId: session.id,
      assessmentId,
      patientId,
      paymentStatus: 'pending',
    };
    await this.paymentSessionRepo.create(paymentSession);

    return { url: session.url };
  }

  async getAllPayment(query: Record<string, any>, includeRelations: boolean): Promise<Payment[]> {
    return this.paymentRepo.findAll(query as any, includeRelations);
  }

  // Save payment after webhook
  async createPayment(data: {
    priceId: string;
    sessionId: string;
    customerEmail: string;
    amount: number;
    currency: string;
    patientId: string;
    assessmentId: string;
    paymentStatus: string;
    userId: string;
  }): Promise<Payment> {
    return this.paymentRepo.create(data);
  }

  // ✅ Update payment session status
  async updatePaymentSessionStatus(sessionId: string, status: string) {
    const session = await this.paymentSessionRepo.findByField('sessionId', sessionId);
    if (session) {
      session.paymentStatus = status;
      return this.paymentSessionRepo.create(session);
    }
    return null;
  }

  /**
   * Fetch all products with their prices
   */
  async getAllProducts() {
    const products = await this.stripe.products.list({ limit: 100 });

    const result = [];

    for (const product of products.data) {
      const prices = await this.stripe.prices.list({
        product: product.id,
        limit: 10,
      });

      result.push({
        productId: product.id,
        name: product.name,
        description: product.description,
        prices: prices.data.map((price) => ({
          priceId: price.id,
          currency: price.currency,
          unit_amount: price.unit_amount,
        })),
      });
    }

    return result;
  }


  async getPriceById(priceId: string) {
    const price = await this.stripe.prices.retrieve(priceId);

    return {
      priceId: price.id,
      currency: price.currency,
      unit_amount: price.unit_amount,
      productId: price.product,
    };
  }




  /**
 * Fetch product details by priceId
 */
  async getProductByPriceId(priceId: string) {
    try {
      // 1️⃣ Get price object
      const price = await this.stripe.prices.retrieve(priceId);

      if (!price || typeof price.product !== 'string') {
        throw new Error('Invalid priceId or product not found');
      }

      // 2️⃣ Get product details from price.product
      const product = await this.stripe.products.retrieve(price.product);

      return {
        productId: product.id,
        name: product.name,
        description: product.description,
        currency: price.currency,
        unit_amount: price.unit_amount,
      };
    } catch (error) {
      console.error('Error fetching product by priceId:', error.message);
      throw error;
    }
  }

}
