import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PropertyService } from "./property.service";

const createProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.createProperty(
    req.body,
    req.user!.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Property created successfully",
    data: result,
  });
});

const getAllProperties = catchAsync(async (_req: Request, res: Response) => {
  const result = await PropertyService.getAllProperties();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getSingleProperty(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property retrieved successfully",
    data: result,
  });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.updateProperty(
    req.params.id,
    req.body,
    req.user!.id
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property updated successfully",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
  await PropertyService.deleteProperty(req.params.id, req.user!.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Property deleted successfully",
    data: null,
  });
});

export const PropertyController = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};