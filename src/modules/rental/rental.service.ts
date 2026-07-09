import httpStatus from "http-status";
import { RentalStatus, Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateRentalRequestPayload } from "./rental.interface";


const createRentalRequest = async (
  tenantId: string,
  payload: CreateRentalRequestPayload
) => {
  const { propertyId, message } = payload;

  // Check property exists
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  // Check property availability
  if (!property.isAvailable) {
    throw new Error(      "Property is not available for rent"
    );
  }

  // Check tenant exists and role
  const tenant = await prisma.user.findUnique({
    where: { id: tenantId },
  });

  if (!tenant) {
    throw new Error("User not found");
  }

  if (tenant.role !== Role.TENANT) {
    throw new Error(      "Only tenants can request a property"
    );
  }

  // Prevent duplicate pending request
  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: RentalStatus.PENDING,
    },
  });

  if (existingRequest) {
    throw new Error(      "You already have a pending request for this property"
    );
  }

  return prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
      message,
    },
    include: {
      property: true,
      tenant: true,
    },
  });
};

const getAllRentalRequests = async () => {
  return prisma.rentalRequest.findMany({
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        include: {
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMyRentalRequests = async (tenantId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getRentalRequestsForLandlord = async (landlordId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: true,
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const approveRentalRequest = async (
  landlordId: string,
  requestId: string
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      property: true,
    },
  });

  if (!request) {
    throw new Error("Rental request not found");
  }

  if (request.property.landlordId !== landlordId) {
    throw new Error(      "You are not authorized to approve this request"
    );
  }

  if (request.status !== RentalStatus.PENDING) {
    throw new Error(      "Rental request has already been processed"
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.rentalRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: RentalStatus.APPROVED,
      },
      include: {
        tenant: true,
        property: true,
      },
    });

    await tx.property.update({
      where: {
        id: request.propertyId,
      },
      data: {
        isAvailable: false,
      },
    });

    return updatedRequest;
  });
};

const rejectRentalRequest = async (
  landlordId: string,
  requestId: string
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      property: true,
    },
  });

  if (!request) {
    throw new Error("Rental request not found");
  }

  if (request.property.landlordId !== landlordId) {
    throw new Error(      "You are not authorized to reject this request"
    );
  }

  if (request.status !== RentalStatus.PENDING) {
    throw new Error(      "Rental request has already been processed"
    );
  }

  return prisma.rentalRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: RentalStatus.REJECTED,
    },
  });
};

const cancelRentalRequest = async (
  tenantId: string,
  requestId: string
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    throw new Error("Rental request not found");
  }

  if (request.tenantId !== tenantId) {
    throw new Error(      "You are not authorized to cancel this request"
    );
  }

  if (request.status !== RentalStatus.PENDING) {
    throw new Error(      "Only pending requests can be cancelled"
    );
  }

  return prisma.rentalRequest.delete({
    where: {
      id: requestId,
    },
  });
};

export const RentalRequestService = {
  createRentalRequest,
  getMyRentalRequests,
  getAllRentalRequests,
  getRentalRequestsForLandlord,
  approveRentalRequest,
  rejectRentalRequest,
  cancelRentalRequest,
};