export type FoundItemsOptions = {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  foundItemName?: string;
  categoryId?: any;
  location?: any;
};

export type FoundItemResponse = {
  id: string;
  foundItemName: string;
  description: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type FoundItemsResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: any[];
};

export interface FoundItem {
  userId: string;
  categoryId: string;
  foundItemName: string;
  description: string;
  location: string;
  dateFound: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  images?: string[];
}
