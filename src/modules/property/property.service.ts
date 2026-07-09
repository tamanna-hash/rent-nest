import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import {
  CreatePropertyPayload,
  UpdatePropertyPayload,
} from "./property.interface";

const createProperty = async (
  payload: CreatePropertyPayload,
  landlordId: string
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return property;
};

const getAllProperties = async () => {
  return await prisma.property.findMany({
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleProperty = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      reviews: true,
      rentals: true,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

const updateProperty = async (
  id: string,
  payload: UpdatePropertyPayload,
  landlordId: string
) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this property"
    );
  }

  return await prisma.property.update({
    where: {
      id,
    },
    data: payload,
    include: {
      category: true,
    },
  });
};

const deleteProperty = async (id: string, landlordId: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new Error(      "You are not authorized to delete this property"
    );
  }

  await prisma.property.delete({
    where: {
      id,
    },
  });

  return null;
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
};