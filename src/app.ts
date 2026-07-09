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
import { UserRoutes } from "./modules/user/user.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

// app.use("/api/subscription/webhook", express.raw({ type: 'application/json' }))
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);
app.use(express.json());
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
app.use("/api/users", UserRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
