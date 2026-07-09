import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handlePaymentSucceeded = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const rentalRequestId = paymentIntent.metadata.rentalRequestId;

  if (!rentalRequestId) {
    console.log("Webhook: Missing rentalRequestId in metadata.");
    return;
  }

  // Update payment record
  await prisma.payment.update({
    where: {
      rentalRequestId,
    },
    data: {
      status: PaymentStatus.PAID,
      transactionId: paymentIntent.id,
    },
  });

  // Update rental request
  await prisma.rentalRequest.update({
    where: {
      id: rentalRequestId,
    },
    data: {
      paymentStatus: PaymentStatus.PAID,
    },
  });
};

export const handlePaymentFailed = async (
  paymentIntent: Stripe.PaymentIntent
) => {
  const rentalRequestId = paymentIntent.metadata.rentalRequestId;

  if (!rentalRequestId) {
    console.log("Webhook: Missing rentalRequestId in metadata.");
    return;
  }

  await prisma.payment.update({
    where: {
      rentalRequestId,
    },
    data: {
      status: PaymentStatus.FAILED,
    },
  });
};