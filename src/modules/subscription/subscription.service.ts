import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handlePaymentSucceeded, handlePaymentFailed } from "./subscription.utils";

const createPaymentIntent = async (userId: string, rentalRequestId: string) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
    include: {
      property: true,
      payment: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental request not found");
  }

  // Ensure the request belongs to the logged-in tenant
  if (rentalRequest.tenantId !== userId) {
    throw new Error("You are not authorized to pay for this rental request");
  }

  // Only approved requests can be paid
  if (rentalRequest.status !== "APPROVED") {
    throw new Error("Rental request has not been approved yet");
  }

  // Prevent duplicate payments
  if (rentalRequest.payment) {
    throw new Error("Payment has already been completed");
  }

  const amount = Math.round(rentalRequest.property.price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      rentalRequestId,
      tenantId: userId,
    },
  });

  await prisma.payment.create({
    data: {
      amount: rentalRequest.property.price,
      provider: "STRIPE",
      status: "PENDING",
      rentalRequestId,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripe_webhook_secret,
  );

  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;

    default:
      console.log(`Unhandled event: ${event.type}`);
  }
};

const getMyPayments = async (userId: string) => {
  return prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: userId,
      },
    },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      rentalRequest: {
        include: {
          property: true,
          tenant: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  // Only the tenant who made the payment or an admin can view it
  if (payment.rentalRequest.tenantId !== userId) {
    throw new Error("You are not authorized to view this payment");
  }

  return payment;
};

export const paymentService = {
  createPaymentIntent,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};
