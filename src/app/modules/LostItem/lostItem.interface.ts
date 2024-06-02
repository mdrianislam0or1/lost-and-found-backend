import { Prisma } from "@prisma/client";

export interface LostItem {
  id: string;
  userId: string;
  categoryId: string;
  lostItemName: string;
  description: string;
  location: string | null;
  isFound: boolean;
  contactInfo?: any | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
