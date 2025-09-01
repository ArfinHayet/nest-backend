import { Controller, Post, Get, Body, Headers, Req, Res, UseGuards } from '@nestjs/common';
import { join } from 'path';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { sendResponse } from 'src/utils/send-response';

@UseGuards(AuthGuard('jwt'))
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Roles('admin', 'user')
  @Post('checkout')
  async createCheckoutSession(
    @Body() body: { priceId: string },
    @Req() req: any, // req.user is added by JwtStrategy
  ) {
    const userId = req.user.userId; // ✅ extract userId from JWT
    return this.paymentService.createCheckoutSession(body.priceId, userId);
  }

  // ✅ Webhook endpoint
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') sig: string,
  ) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.paymentService['stripe'].webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret,
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      // ✅ update PaymentSession status to "paid"
      await this.paymentService.updatePaymentSessionStatus(
        session.id,
        session.payment_status,
      );

      // Fetch line items to get priceId
      const lineItems =
        await this.paymentService['stripe'].checkout.sessions.listLineItems(
          session.id,
        );

      for (const item of lineItems.data) {
        await this.paymentService.createPayment({
          priceId: item.price?.id,
          sessionId: session.id,
          customerEmail: session.customer_details?.email,
          amount: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          currency: item.price?.currency,
          paymentStatus: session.payment_status,
        });
      }
    }

    res.json({ received: true });
  }

  @Roles('admin')
  @Get('products')
  getAllProducts() {
    return this.paymentService.getAllProducts();
  }


  @Roles('admin','user','clinician')
  @Get('')
  async getAllPayments() {
    const paymentList = await this.paymentService.getAllPayment() 
    return sendResponse(paymentList, 'Payment List created successfully', 201);
  }

  // ✅ Success page route
  @Get('success')
  getSuccessPage(@Res() res: Response) {
    const filePath = join(__dirname, 'view', 'success.html');
    return res.sendFile(filePath);
  }

  // ✅ Cancel page route
  @Get('cancel')
  getCancelPage(@Res() res: Response) {
    const filePath = join(__dirname, 'view', 'cancel.html');
    return res.sendFile(filePath);
  }
}
