import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { authRoutes } from "./modules/auth/auth.route";
import { PropertyRoutes } from "./modules/property/property.route";
import { CategoryRoutes } from "./modules/category/category.route";
import { RentalRequestRoutes } from "./modules/rental/rental.route";
import { ReviewRoutes } from "./modules/review/review.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { AdminRoutes } from "./modules/admin/admin.route";
import { LandlordRoutes } from "./modules/landlord/landlord.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// Stripe webhook needs the raw body buffer for signature verification.
// Register express.raw() ONLY for the webhook path, BEFORE express.json().
// This must come first so the stream is consumed as raw bytes for this route.
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

// All other routes get JSON parsing with rawBody capture as a fallback
app.use(
  express.json({
    verify: (req: Request & { rawBody?: Buffer }, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/rentals", RentalRequestRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/landlord", LandlordRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
