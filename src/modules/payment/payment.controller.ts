import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentIntent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { rentalRequestId } = req.body;

    const result = await paymentService.createPaymentIntent(
      userId,
      rentalRequestId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment intent created successfully",
      data: result,
    });
  },
);

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { rentalRequestId } = req.body;

    const result = await paymentService.createCheckoutSession(
      userId,
      rentalRequestId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (
    req: Request & { rawBody?: Buffer },
    res: Response,
    next: NextFunction,
  ) => {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    // express.raw() puts the raw Buffer directly on req.body for this route.
    // req.rawBody is a fallback captured by the express.json() verify callback
    // on other routes — not needed here but kept for safety.
    const payload: Buffer = Buffer.isBuffer(req.body)
      ? req.body
      : (req.rawBody ?? Buffer.from(JSON.stringify(req.body)));

    if (!payload || payload.length === 0) {
      res.status(400).json({ error: "Empty webhook payload" });
      return;
    }

    await paymentService.handleWebhook(payload, signature);

    res.status(200).json({ received: true });
  },
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    const result = await paymentService.getMyPayments(userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payments retrieved successfully",
      data: result,
    });
  },
);


const getPaymentById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const result = await paymentService.getPaymentById(id as string, userId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};
