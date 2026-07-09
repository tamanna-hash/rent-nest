import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import httpStatus from "http-status";
import { handlePaymentSucceeded } from "./subscription.utils";

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

export const paymentService = {
  createPaymentIntent,
  handleWebhook,
  getMyPayments,
};
