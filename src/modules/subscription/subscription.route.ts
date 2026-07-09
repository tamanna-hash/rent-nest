import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./subscription.controller";


const router = Router();

// Create Payment Intent
router.post(
  "/create-payment-intent",
  auth(Role.TENANT),
  paymentController.createPaymentIntent
);

// Stripe Webhook
router.post(
  "/webhook",
  paymentController.handleWebhook
);

// Get Logged-in Tenant's Payment History
router.get(
  "/my-payments",
  auth(Role.TENANT),
  paymentController.getMyPayments
);

export const paymentRoutes = router;