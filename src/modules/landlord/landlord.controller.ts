import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { LandlordService } from "./landlord.service";

// ── Properties ────────────────────────────────────────────────────────────────

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.createProperty(req.user!.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

const getMyProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.getMyProperties(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.updateProperty(
    req.user!.id,
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  await LandlordService.deleteProperty(req.user!.id, req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: null,
  });
});

// ── Rental Requests ───────────────────────────────────────────────────────────

const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.getMyRequests(req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

const getSingleRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.getSingleRequest(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request retrieved successfully",
    data: result,
  });
});

const approveRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.approveRequest(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request approved successfully",
    data: result,
  });
});

const rejectRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await LandlordService.rejectRequest(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request rejected successfully",
    data: result,
  });
});

export const LandlordController = {
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getMyRequests,
  getSingleRequest,
  approveRequest,
  rejectRequest,
};
