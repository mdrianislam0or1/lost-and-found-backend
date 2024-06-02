import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { FoundItemServices } from "./foundItem.service";
import { foundItemSchema } from "./foundItem.validation";
import { z } from "zod";

const createFoundItemCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const foundItemCategory = await FoundItemServices.createFoundItemCategory(
      name
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Found item category created successfully",
      data: foundItemCategory,
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

const getFoundItemCategories = async (req: Request, res: Response) => {
  try {
    const categories = await FoundItemServices.getFoundItemCategories();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Found item categories retrieved successfully",
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

const reportFoundItem = async (req: Request, res: Response) => {
  try {
    const parsedBody = foundItemSchema.parse(req.body);
    const userId = (req as any).user.id;
    const foundItem = await FoundItemServices.reportFoundItem({
      ...parsedBody,
      userId,
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Found item reported successfully",
      data: foundItem,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || "Internal server error",
    });
  }
};

const getMyFoundItems = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const foundItems = await FoundItemServices.getMyFoundItems(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Found items retrieved successfully",
      data: foundItems,
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

const getFoundItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      searchTerm,
      page,
      limit,
      sortBy,
      sortOrder,
      foundItemName,
      categoryId,
      location,
    } = req.query;

    const options = {
      searchTerm: searchTerm?.toString(),
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy?.toString(),
      sortOrder: sortOrder?.toString(),
      foundItemName: foundItemName?.toString(),
      categoryId: categoryId?.toString(),
      location: location?.toString(),
    };

    const foundItems = await FoundItemServices.getFoundItems(options);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Found items retrieved successfully",
      data: foundItems,
    });
  } catch (error: any) {
    console.error("Error fetching found items:", error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getRecentlyReportedFoundItems = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const foundItems = await FoundItemServices.getRecentlyReportedFoundItems(
      limit
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Recently reported found items retrieved successfully",
      data: foundItems,
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

const updateFoundItem = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const updateData = req.body;

    const updatedItem = await FoundItemServices.updateFoundItem(
      itemId,
      userId,
      updateData
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Found item updated successfully",
      data: updatedItem,
    });
  } catch (error: any) {
    console.error("Error updating found item:", error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
};

const getSingleFoundItemById = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const foundItem = await FoundItemServices.getSingleFoundItemById(itemId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Found item retrieved successfully",
      data: foundItem,
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

const deleteFoundItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { itemId } = req.params;

    const deletedItem = await FoundItemServices.deleteFoundItem(itemId, userId);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Found item deleted successfully",
      data: deletedItem,
    });
  } catch (error: any) {
    console.error("Error deleting found item:", error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: error.message || "Internal server error",
    });
  }
};

export const FoundItemController = {
  createFoundItemCategory,
  getFoundItemCategories,
  reportFoundItem,
  getFoundItems,
  getMyFoundItems,
  updateFoundItem,
  getRecentlyReportedFoundItems,
  getSingleFoundItemById,
  deleteFoundItem,
};
