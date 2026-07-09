import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// ── Users ─────────────────────────────────────────────────────────────────────

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      updatedAt: true,
    },
  });
};

// ── Properties ────────────────────────────────────────────────────────────────

const getAllProperties = async () => {
  return prisma.property.findMany({
    include: {
      category: true,
      landlord: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { rentals: true, reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// ── Rental Requests ───────────────────────────────────────────────────────────

const getAllRentalRequests = async () => {
  return prisma.rentalRequest.findMany({
    include: {
      tenant: {
        select: { id: true, name: true, email: true },
      },
      property: {
        include: {
          landlord: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};
