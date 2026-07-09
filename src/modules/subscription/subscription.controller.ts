import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./subscription.service";

const createPaymentIntent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { rentalRequestId } = req.body;

    const result = await paymentService.createPaymentIntent(userId, rentalRequestId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment intent created successfully",
      data: result,
    });
  }
);

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { rentalRequestId } = req.body;

    const result = await paymentService.createCheckoutSession(userId, rentalRequestId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  }
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"] as string;

    await paymentService.handleWebhook(payload, signature);

    res.status(200).json({ received: true });
  }
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
  }
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
  }
);

export const paymentController = {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};