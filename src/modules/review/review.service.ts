import httpStatus from "http-status";
import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateReviewPayload } from "./review.interface";

const createReview = async (
  tenantId: string,
  payload: CreateReviewPayload
) => {
  const { propertyId, rating, comment } = payload;

  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error( "Property not found");
  }

  if (rating < 1 || rating > 5) {
    throw new Error(
      "Rating must be between 1 and 5"
    );
  }

  const approvedRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: RentalStatus.APPROVED,
    },
  });

  if (!approvedRental) {
    throw new Error(
      "You can only review properties you have rented"
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId,
      },
    },
  });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this property"
    );
  }

  return prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rating,
      comment,
    },
    include: {
      tenant: true,
      property: true,
    },
  });
};

const getReviewsByProperty = async (propertyId: string) => {
  return prisma.review.findMany({
    where: {
      propertyId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateReview = async (
  tenantId: string,
  reviewId: string,
  payload: Partial<CreateReviewPayload>
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error( "Review not found");
  }

  if (review.tenantId !== tenantId) {
    throw new Error(
      "You are not authorized to update this review"
    );
  }

  if (
    payload.rating !== undefined &&
    (payload.rating < 1 || payload.rating > 5)
  ) {
    throw new Error(
      "Rating must be between 1 and 5"
    );
  }

  return prisma.review.update({
    where: {
      id: reviewId,
    },
    data: payload,
    include: {
      tenant: true,
      property: true,
    },
  });
};

const deleteReview = async (
  tenantId: string,
  reviewId: string
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error( "Review not found");
  }

  if (review.tenantId !== tenantId) {
    throw new Error(
      "You are not authorized to delete this review"
    );
  }

  return prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
};

export const ReviewService = {
  createReview,
  getReviewsByProperty,
  updateReview,
  deleteReview,
};