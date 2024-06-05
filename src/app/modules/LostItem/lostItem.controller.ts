import { Request, Response } from "express";
import httpStatus from "http-status";
import { LostItemService } from "./lostItem.service";
import sendResponse from "../../shared/sendResponse";
import { LostItem } from "@prisma/client";

const createLostItemCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const lostItemCategory = await LostItemService.createLostItemCategory(name);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Lost item category created successfully",
      data: lostItemCategory,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const getLostItemCategories = async (req: Request, res: Response) => {
  try {
    const categories = await LostItemService.getLostItemCategories();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Lost item categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const reportLostItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      categoryId,
      lostItemName,
      description,
      location,
      isFound,
      contactInfo,
      images,
    } = req.body;

    const typedContactInfo: { phone?: string; email?: string } =
      typeof contactInfo === "object" ? contactInfo : {};

    const lostItemData: Omit<LostItem, "id" | "createdAt" | "updatedAt"> = {
      userId,
      categoryId,
      lostItemName,
      description,
      location: location || null,
      isFound: isFound || false,
      contactInfo: typedContactInfo,
      images: images || [],
    };

    const lostItem = await LostItemService.reportLostItem(
      lostItemData as Omit<LostItem, "id" | "createdAt" | "updatedAt">
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Lost item reported successfully",
      data: lostItem,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const getLostItems = async (req: Request, res: Response) => {
  try {
    const {
      searchTerm,
      categoryId,
      location,
      page = 1,
      limit = 10,
    } = req.query;
    const result = await LostItemService.getLostItems(
      searchTerm as string,
      categoryId as string | null,
      location as string | null,
      Number(page),
      Number(limit)
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Lost items retrieved successfully",
      data: result.lostItems,
      meta: {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const getMyLostItems = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await LostItemService.getLostItemsByUserId(userId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User's lost items retrieved successfully",
      data: result.lostItems,
      meta: {
        total: result.total,
      },
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const getRecentlyReportedLostItems = async (req: Request, res: Response) => {
  try {
    const lostItems = await LostItemService.getRecentlyReportedLostItems();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recently reported lost items retrieved successfully",
      data: lostItems,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const getSingleLostItemById = async (req: Request, res: Response) => {
  try {
    const lostItemId = req.params.id;
    const lostItem = await LostItemService.getSingleLostItemById(lostItemId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Lost item retrieved successfully",
      data: lostItem,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const updateLostItem = async (req: Request, res: Response) => {
  try {
    // const userId = (req as any).user.id;
    const lostItemId = req.params.id;
    const updatedData = req.body;
    const updatedLostItem = await LostItemService.updateLostItem(
      // userId,
      lostItemId,
      updatedData
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Lost item updated successfully",
      data: updatedLostItem,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const deleteLostItem = async (req: Request, res: Response) => {
  try {
    // const userId = (req as any).user.id;
    const lostItemId = req.params.id;
    const deletedLostItem = await LostItemService.deleteLostItem(
      // userId,
      lostItemId
    );

    if (!deletedLostItem) {
      sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message:
          "Lost item not found or you don't have permission to delete it",
        data: null,
      });
      return;
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Lost item deleted successfully",
      data: deletedLostItem,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

const updateIsFound = async (req: Request, res: Response) => {
  try {
    // const userId = (req as any).user.id;
    const lostItemId = req.params.id;
    const { isFound } = req.body;

    if (typeof isFound !== "boolean") {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Invalid 'isFound' value. It should be a boolean.",
        data: null,
      });
      return;
    }

    const updatedLostItem = await LostItemService.updateIsFound(
      // userId,
      lostItemId,
      isFound
    );

    if (!updatedLostItem) {
      sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message:
          "Lost item not found or you don't have permission to update it",
        data: null,
      });
      return;
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "'isFound' value updated successfully",
      data: updatedLostItem,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Internal server error",
      data: null,
    });
  }
};

export const LostItemController = {
  createLostItemCategory,
  getLostItemCategories,
  reportLostItem,
  getLostItems,
  getMyLostItems,
  getRecentlyReportedLostItems,
  getSingleLostItemById,
  updateLostItem,
  deleteLostItem,
  updateIsFound,
};
