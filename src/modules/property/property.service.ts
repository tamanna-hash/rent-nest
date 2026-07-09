import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import {
  CreatePropertyPayload,
  PropertyFilters,
  UpdatePropertyPayload,
} from "./property.interface";
import { Prisma } from "../../../generated/prisma/client";


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

const getAllProperties = async (filters: PropertyFilters = {}) => {
  const {
    search,
    location,
    minPrice,
    maxPrice,
    propertyType,
    amenities,
    page = 1,
    limit = 20,
  } = filters;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (location) {
    andConditions.push({
      location: { contains: location, mode: "insensitive" },
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    andConditions.push({
      price: {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      },
    });
  }

  if (propertyType) {
    andConditions.push({
      category: { name: { equals: propertyType, mode: "insensitive" } },
    });
  }

  if (amenities && amenities.length > 0) {
    andConditions.push({
      amenities: { hasEvery: amenities }, // use `hasSome` if you want ANY match instead of ALL
    });
  }

  const where: Prisma.PropertyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
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
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    data: properties,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export default getAllProperties;


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