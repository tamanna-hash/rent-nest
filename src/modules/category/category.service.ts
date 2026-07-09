import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";

interface CreateCategoryPayload {
  name: string;
}

interface UpdateCategoryPayload {
  name?: string;
}

const createCategory = async (payload: CreateCategoryPayload) => {
  const isCategoryExists = await prisma.category.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (isCategoryExists) {
    throw new Error("Category already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getAllCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const updateCategory = async (id: string, payload: UpdateCategoryPayload) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (payload.name) {
    const isNameTaken = await prisma.category.findFirst({
      where: {
        name: payload.name,
        NOT: {
          id,
        },
      },
    });

    if (isNameTaken) {
      throw new Error("Category already exists");
    }
  }

  return await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      properties: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.properties.length > 0) {
    throw new Error("Cannot delete category because it contains properties");
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });

  return null;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
