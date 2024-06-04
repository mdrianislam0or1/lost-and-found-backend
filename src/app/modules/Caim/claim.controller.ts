import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { ClaimServices } from "./claim.service";

const createClaim = async (req: Request, res: Response) => {
  try {
    const {
      foundItemId,
      distinguishingFeatures,
      proofOfPurchase,
      photos,
      ownershipDocs,
      detailedLossAccount,
      matchingAccessories,
      securityFeatures,
      thirdPartyConfirmation,
      lostDate,
    } = req.body;
    const userId = (req as any).user.id;

    const claim = await ClaimServices.createClaim(
      userId,
      foundItemId,
      distinguishingFeatures,
      new Date(lostDate),
      proofOfPurchase,
      photos,
      ownershipDocs,
      detailedLossAccount,
      matchingAccessories,
      securityFeatures,
      thirdPartyConfirmation
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Claim created successfully",
      data: claim,
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

const getClaims = async (req: Request, res: Response) => {
  try {
    const claims = await ClaimServices.getClaims();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Claims retrieved successfully",
      data: claims,
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

const getMyClaims = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const claims = await ClaimServices.getUserClaims(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Claims retrieved successfully",
      data: claims,
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

const updateClaimStatus = async (req: Request, res: Response) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body;

    const updatedClaim = await ClaimServices.updateClaimStatus(claimId, status);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Claim updated successfully",
      data: updatedClaim,
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

const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const profile = await ClaimServices.getProfile(userId);

    if (!profile) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Profile not found",
        data: null,
      });
    }

    return res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully",
      data: {
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        age: profile.age,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        user: {
          id: (profile as any).user.id,
          name: (profile as any).user.name,
          email: (profile as any).user.email,
          createdAt: (profile as any).user.createdAt,
          updatedAt: (profile as any).user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      data: null,
    });
  }
};

const updateMyProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, bio, age } = req.body;
    const userId = (req as any).user.id;

    const updatedProfile = await ClaimServices.updateProfile(userId, {
      name,
      email,
      bio,
      age,
    });

    if (!updatedProfile) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Profile not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully",
      data: {
        id: updatedProfile.id,
        userId: updatedProfile.userId,
        bio: updatedProfile.bio,
        age: updatedProfile.age,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
        user: {
          id: (updatedProfile as any).user.id,
          name: (updatedProfile as any).user.name,
          email: (updatedProfile as any).user.email,
          createdAt: (updatedProfile as any).user.createdAt,
          updatedAt: (updatedProfile as any).user.updatedAt,
        },
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

const deleteClaim = async (req: Request, res: Response) => {
  try {
    const { claimId } = req.params;

    const deletedClaim = await ClaimServices.deleteClaim(claimId);

    if (!deletedClaim) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Claim not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Claim deleted successfully",
      data: deletedClaim,
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
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await ClaimServices.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data: users,
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

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const updatedUser = await ClaimServices.updateUserStatus(userId, status);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
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

const getWebsiteMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = await ClaimServices.getWebsiteMetrics();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Website metrics retrieved successfully",
      data: metrics,
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

export const ClaimController = {
  createClaim,
  getClaims,
  getMyClaims,
  updateClaimStatus,
  getProfile,
  updateMyProfile,
  deleteClaim,
  getAllUsers,
  updateUserStatus,
  getWebsiteMetrics,
};
