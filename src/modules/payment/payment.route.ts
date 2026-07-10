import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

// Create Payment Intent (Stripe Elements / in-page payment)
router.post(
  "/create-payment-intent",
  auth(Role.TENANT),
  paymentController.createPaymentIntent,
);

// Create Checkout Session (Stripe-hosted page with success/cancel redirect)
router.post(
  "/create-checkout-session",
  auth(Role.TENANT),
  paymentController.createCheckoutSession,
);

// Stripe Webhook (raw body — must come before express.json())
router.post("/webhook", paymentController.handleWebhook);

// Get logged-in tenant's full payment history
router.get("/my-payments", auth(Role.TENANT), paymentController.getMyPayments);

// Get a single payment by ID
router.get("/:id", auth(Role.TENANT), paymentController.getPaymentById);

export const paymentRoutes = router;
