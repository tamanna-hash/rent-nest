import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RentalRequestService } from "./rentalRequest.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalRequestService.createRentalRequest(
    req.user!.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rental request created successfully",
    data: result,
  });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RentalRequestService.getMyRentalRequests(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const getRentalRequestsForLandlord = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await RentalRequestService.getRentalRequestsForLandlord(req.user!.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental requests retrieved successfully",
      data: result,
    });
  }
);

const approveRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RentalRequestService.approveRentalRequest(
      req.user!.id,
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request approved successfully",
      data: result,
    });
  }
);

const rejectRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RentalRequestService.rejectRentalRequest(
      req.user!.id,
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request rejected successfully",
      data: result,
    });
  }
);

const cancelRentalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RentalRequestService.cancelRentalRequest(
      req.user!.id,
      req.params.id
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental request cancelled successfully",
      data: result,
    });
  }
);

export const RentalRequestController = {
  createRentalRequest,
  getMyRentalRequests,
  getRentalRequestsForLandlord,
  approveRentalRequest,
  rejectRentalRequest,
  cancelRentalRequest,
};