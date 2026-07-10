import Stripe from "stripe";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handlePaymentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const rentalRequestId = paymentIntent.metadata.rentalRequestId;

  if (!rentalRequestId) {
    console.log("Webhook: Missing rentalRequestId in metadata.");
    return;
  }

  // Idempotency guard — skip if already processed
  const payment = await prisma.payment.findUnique({ where: { rentalRequestId } });
  if (!payment || payment.status === PaymentStatus.COMPLETED) return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { rentalRequestId },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId: paymentIntent.id,
        paidAt: new Date(),
      },
    }),
    prisma.rentalRequest.update({
      where: { id: rentalRequestId },
      data: { status: RentalStatus.ACTIVE },
    }),
  ]);
};

export const handlePaymentFailed = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const rentalRequestId = paymentIntent.metadata.rentalRequestId;

  if (!rentalRequestId) {
    console.log("Webhook: Missing rentalRequestId in metadata.");
    return;
  }

  // Idempotency guard — skip if already in a terminal state
  const payment = await prisma.payment.findUnique({ where: { rentalRequestId } });
  if (!payment || payment.status === PaymentStatus.COMPLETED || payment.status === PaymentStatus.FAILED) return;

  await prisma.payment.update({
    where: { rentalRequestId },
    data: { status: PaymentStatus.FAILED },
  });
};

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const rentalRequestId = session.metadata?.rentalRequestId;

  if (!rentalRequestId) {
    console.log("Webhook: Missing rentalRequestId in session metadata.");
    return;
  }

  // Idempotency guard — skip if already processed
  const payment = await prisma.payment.findUnique({ where: { rentalRequestId } });
  if (!payment || payment.status === PaymentStatus.COMPLETED) return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { rentalRequestId },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId: session.payment_intent as string,
        paidAt: new Date(),
      },
    }),
    prisma.rentalRequest.update({
      where: { id: rentalRequestId },
      data: { status: RentalStatus.ACTIVE },
    }),
  ]);
};