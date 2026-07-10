import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  CreatePropertyPayload,
  UpdatePropertyPayload,
} from "../property/property.interface";

// ── Properties ────────────────────────────────────────────────────────────────

const createProperty = async (
  landlordId: string,
  payload: CreatePropertyPayload,
) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) throw new Error("Category not found");

  return prisma.property.create({
    data: { ...payload, landlordId },
    include: {
      category: true,
      landlord: { select: { id: true, name: true, email: true } },
    },
  });
};

const getMyProperties = async (landlordId: string) => {
  return prisma.property.findMany({
    where: { landlordId },
    include: {
      category: true,
      _count: { select: { rentals: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateProperty = async (
  landlordId: string,
  propertyId: string,
  payload: UpdatePropertyPayload,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) throw new Error("Property not found");
  if (property.landlordId !== landlordId)
    throw new Error("You are not authorized to update this property");

  return prisma.property.update({
    where: { id: propertyId },
    data: payload,
    include: { category: true },
  });
};

const deleteProperty = async (landlordId: string, propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) throw new Error("Property not found");
  if (property.landlordId !== landlordId)
    throw new Error("You are not authorized to delete this property");

  await prisma.property.delete({ where: { id: propertyId } });

  return null;
};

// ── Rental Requests ───────────────────────────────────────────────────────────

const getSingleRequest = async (landlordId: string, requestId: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: {
      tenant: {
        select: { id: true, name: true, email: true, phone: true, image: true },
      },
      property: true,
      payment: true,
    },
  });

  if (!request) throw new Error("Rental request not found");

  // Ensure the request belongs to one of this landlord's properties
  if (request.property.landlordId !== landlordId)
    throw new Error("You are not authorized to view this request");

  return request;
};

const getMyRequests = async (landlordId: string) => {
  return prisma.rentalRequest.findMany({
    where: { property: { landlordId } },
    include: {
      tenant: {
        select: { id: true, name: true, email: true, phone: true, image: true },
      },
      property: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const approveRequest = async (landlordId: string, requestId: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true },
  });

  if (!request) throw new Error("Rental request not found");
  if (request.property.landlordId !== landlordId)
    throw new Error("You are not authorized to approve this request");
  if (request.status !== RentalStatus.PENDING)
    throw new Error("Rental request has already been processed");

  return prisma.$transaction(async (tx) => {
    const updated = await tx.rentalRequest.update({
      where: { id: requestId },
      data: { status: RentalStatus.APPROVED },
      include: { tenant: true, property: true },
    });

    await tx.property.update({
      where: { id: request.propertyId },
      data: { isAvailable: false },
    });

    return updated;
  });
};

const rejectRequest = async (landlordId: string, requestId: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id: requestId },
    include: { property: true },
  });

  if (!request) throw new Error("Rental request not found");
  if (request.property.landlordId !== landlordId)
    throw new Error("You are not authorized to reject this request");
  if (request.status !== RentalStatus.PENDING)
    throw new Error("Rental request has already been processed");

  return prisma.rentalRequest.update({
    where: { id: requestId },
    data: { status: RentalStatus.REJECTED },
    include: { tenant: true, property: true },
  });
};

export const LandlordService = {
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getMyRequests,
  getSingleRequest,
  approveRequest,
  rejectRequest,
};
