import { Controller, Post, Get, Body, Headers, Req, Res, UseGuards, Query, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { sendResponse } from 'src/utils/send-response';
import { PatientService } from 'src/patient/patient.service';
import { AssessmentService } from 'src/assessment/assessment.service';


@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly patientService: PatientService,
    private readonly assessmentService: AssessmentService,
  ) { }
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin', 'user')
  @Post('checkout')
  async createCheckoutSession(
    @Body() body: { priceId: string; assessmentId?: string; patientId?: string },
    @Req() req: any,
  ) {
    const userId = req.user.userId;

    const patientInfo = await this.patientService.findById(body.patientId as unknown as number);
    if (!patientInfo) {
      throw new NotFoundException('Patient not found');
    }

    const assessment = await this.assessmentService.findById(body.assessmentId as unknown as number);
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const session = await this.paymentService.createCheckoutSession(
      body.priceId,
      body.assessmentId,
      body.patientId,
      userId,
    );

    // ⚡ Only in local: simulate webhook call after 1 minute
    if (process.env.NODE_ENV === 'development') {
      setTimeout(async () => {
        console.log('⚡ Triggering mock webhook for session:', 'tx1234567890');
        // Call same logic as webhook handler
        await this.paymentService.updatePaymentSessionStatus(
          'tx1234567890',
          'paid',
        );

        await this.paymentService.createPayment({
          priceId: body.priceId,
          sessionId: 'tx1234567890',
          customerEmail: 'mock@example.com',
          amount: 100, // mock value
          currency: 'usd',
          assessmentId: body.assessmentId,
          patientId: body.patientId,
          paymentStatus: 'paid',
        });

        console.log('✅ Mock webhook processed');
      }, 60 * 1000); // 1 min
    }

    return session;
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

      console.log("session", session)

      // ✅ update PaymentSession status to "paid"
      const updatedPaymentSession = await this.paymentService.updatePaymentSessionStatus(
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
          assessmentId: updatedPaymentSession?.assessmentId,
          patientId: updatedPaymentSession?.patientId,
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


  @Roles('admin', 'user', 'clinician')
  @Get('')
  async getAllPayments(@Query() query: Record<string, any>) {
    const paymentList = await this.paymentService.getAllPayment(query as any, true)
    return sendResponse(paymentList, 'Payment List retrieved successfully', 201);
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
