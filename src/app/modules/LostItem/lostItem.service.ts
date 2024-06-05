import { Prisma, PrismaClient } from "@prisma/client";
import { LostItem } from "./lostItem.interface";
const prisma = new PrismaClient();

const createLostItemCategory = async (name: string) => {
  const lostItemCategory = await prisma.lostItemCategory.create({
    data: { name },
  });
  return lostItemCategory;
};

const getLostItemCategories = async () => {
  const categories = await prisma.lostItemCategory.findMany();
  return categories;
};

const reportLostItem = async (
  data: Omit<LostItem, "id" | "createdAt" | "updatedAt">
) => {
  const lostItem = await prisma.lostItem.create({
    data: {
      userId: data.userId,
      categoryId: data.categoryId,
      lostItemName: data.lostItemName,
      description: data.description,
      location: data.location,
      isFound: data.isFound,
      contactInfo: data.contactInfo as any,
      images: data.images,
    },
  });
  return lostItem;
};

const getLostItems = async (
  searchTerm: string,
  categoryId: string | null,
  location: string | null,
  page: number,
  limit: number
) => {
  const whereClause: Prisma.LostItemWhereInput = {
    AND: [
      searchTerm
        ? {
            OR: [
              { lostItemName: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
            ],
          }
        : {},
      categoryId ? { categoryId: categoryId } : {},
      location ? { location: { contains: location, mode: "insensitive" } } : {},
    ],
  };

  const lostItems = await prisma.lostItem.findMany({
    where: whereClause,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.lostItem.count({ where: whereClause });

  return { lostItems, total };
};

const getLostItemsByUserId = async (userId: string) => {
  const lostItems = await prisma.lostItem.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.lostItem.count({
    where: {
      userId,
    },
  });

  return { lostItems, total };
};

const getRecentlyReportedLostItems = async (): Promise<LostItem[]> => {
  const lostItems = await prisma.lostItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      category: true,
    },
    take: 10,
  });

  return lostItems;
};

const getSingleLostItemById = async (
  lostItemId: string
): Promise<LostItem | null> => {
  const lostItem = await prisma.lostItem.findUnique({
    where: {
      id: lostItemId,
    },
  });
  return lostItem;
};

const updateLostItem = async (
  // userId: string,
  lostItemId: string,
  data: Partial<LostItem>
) => {
  const { contactInfo, ...restData } = data;

  const contactInfoValue: any = contactInfo !== undefined ? contactInfo : null;

  const updatedLostItem = await prisma.lostItem.updateMany({
    where: {
      id: lostItemId,
      // userId,
    },
    data: {
      ...restData,
      contactInfo: contactInfoValue,
    },
  });
  return updatedLostItem;
};

const deleteLostItem = async (
  // userId: string,
  lostItemId: string
) => {
  const deletedLostItem = await prisma.lostItem.deleteMany({
    where: {
      id: lostItemId,
      // userId,
    },
  });

  if (deletedLostItem.count === 0) {
    return null;
  }

  return deletedLostItem;
};

const updateIsFound = async (
  // userId: string,
  lostItemId: string,
  isFound: boolean
) => {
  const updatedLostItem = await prisma.lostItem.updateMany({
    where: {
      id: lostItemId,
      // userId,
    },
    data: {
      isFound,
    },
  });

  if (updatedLostItem.count === 0) {
    return null;
  }

  return updatedLostItem;
};

export const LostItemService = {
  createLostItemCategory,
  getLostItemCategories,
  reportLostItem,
  getLostItems,
  getLostItemsByUserId,
  updateLostItem,
  getSingleLostItemById,
  getRecentlyReportedLostItems,
  deleteLostItem,
  updateIsFound,
};
