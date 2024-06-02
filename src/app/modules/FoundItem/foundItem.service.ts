import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import {
  FoundItem,
  FoundItemsOptions,
  FoundItemsResponse,
} from "./foundItem.inteface";

const createFoundItemCategory = async (name: string) => {
  const foundItemCategory = await prisma.foundItemCategory.create({
    data: { name },
  });
  return foundItemCategory;
};

const getFoundItemCategories = async () => {
  const categories = await prisma.foundItemCategory.findMany();
  return categories;
};

const reportFoundItem = async (data: FoundItem) => {
  const foundItem = await prisma.foundItem.create({
    data: {
      userId: data.userId,
      categoryId: data.categoryId,
      foundItemName: data.foundItemName,
      description: data.description,
      location: data.location,
      dateFound: new Date(data.dateFound),
      contactInfo: data.contactInfo || {},
      images: data.images || [],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return foundItem;
};

const getFoundItems = async (
  options: FoundItemsOptions
): Promise<FoundItemsResponse> => {
  const {
    searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
    foundItemName,
    categoryId,
    location,
  } = options;

  const { skip, take } = calculatePagination({ page, limit });

  const queryOptions: any = {
    where: {
      AND: [
        searchTerm && {
          OR: [
            { foundItemName: { contains: searchTerm, mode: "insensitive" } },
            { location: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        categoryId && { categoryId },
        location && { location: { contains: location, mode: "insensitive" } },
      ].filter(Boolean),
    },
    include: {
      user: true,
      category: true,
    },
    orderBy: {
      [sortBy || "createdAt"]: sortOrder === "asc" ? "asc" : "desc",
    },
    skip,
    take,
  };

  if (foundItemName) {
    queryOptions.where.foundItemName = {
      contains: foundItemName,
      mode: "insensitive",
    };
  }

  try {
    const foundItems = await prisma.foundItem.findMany(queryOptions);
    const total = await prisma.foundItem.count({ where: queryOptions.where });

    return {
      success: true,
      statusCode: 200,
      message: "Found items retrieved successfully",
      meta: {
        total,
        page: page || 1,
        limit: take,
      },
      data: foundItems,
    };
  } catch (error: any) {
    throw new Error(`Error fetching found items: ${error.message}`);
  }
};

const calculatePagination = (options: { page?: number; limit?: number }) => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  return { skip, take: limit };
};

const getMyFoundItems = async (userId: string) => {
  const foundItems = await prisma.foundItem.findMany({
    where: { userId },
    include: {
      category: true,
    },
  });
  return foundItems;
};

const deleteFoundItem = async (itemId: string, userId: string) => {
  await prisma.foundItem.deleteMany({
    where: { id: itemId, userId },
  });
};

const getRecentlyReportedFoundItems = async (limit: number = 10) => {
  const foundItems = await prisma.foundItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    include: {
      user: true,
      category: true,
    },
  });
  return foundItems;
};

const updateFoundItem = async (
  itemId: string,
  userId: string,
  data: Partial<FoundItem>
) => {
  const foundItem = await prisma.foundItem.updateMany({
    where: { id: itemId, userId },
    data,
  });
  return foundItem;
};

const getSingleFoundItemById = async (itemId: string) => {
  const foundItem = await prisma.foundItem.findUnique({
    where: { id: itemId },
    include: {
      user: true,
      category: true,
    },
  });

  if (!foundItem) {
    throw new Error("Found item not found");
  }

  return foundItem;
};

export const FoundItemServices = {
  createFoundItemCategory,
  getFoundItemCategories,
  reportFoundItem,
  getFoundItems,
  getMyFoundItems,
  updateFoundItem,
  deleteFoundItem,
  getRecentlyReportedFoundItems,
  getSingleFoundItemById,
};
