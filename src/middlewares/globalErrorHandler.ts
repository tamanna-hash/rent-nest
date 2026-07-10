import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";


export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "You have provided incorrect field type or missing fields";
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Duplicate Key Error";
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Foreign key constraint failed";
        } else if (err.code === "P2025") {
            statusCode = httpStatus.NOT_FOUND;
            errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = httpStatus.UNAUTHORIZED;
            errorMessage = "Authentication failed against database server. Please check your credentials.";
        } else if (err.errorCode === "P1001") {
            statusCode = httpStatus.BAD_REQUEST;
            errorMessage = "Can't reach database server.";
        }
    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Error occurred during query execution.";
    }

    // Stripe webhook errors: always respond 200 so Stripe doesn't retry.
    // Signature failures (WebhookSignatureVerificationError) should not trigger retries.
    if (req.path === "/api/payments/webhook") {
        console.error("Webhook error:", errorMessage);
        res.status(200).json({ received: true, error: errorMessage });
        return;
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        name: errorName,
        message: errorMessage,
        error: err.stack,
    });
};