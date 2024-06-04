import { Request, Response } from "express";
import httpStatus from "http-status";

import sendResponse from "../../shared/sendResponse";
import { UserServices } from "./user.sevice";
import { jwtHelpers, validatePassword } from "../../helpars/jwtHelpers";
import prisma from "../../shared/prisma";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, profile, role } = req.body;
    const user = await UserServices.registerUser(
      name,
      email,
      password,
      profile,
      role
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile,
    };

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: userData,
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while registering the user",
      data: null,
    });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.body;
    const user = await UserServices.updateUserStatus(userId, status);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "An error occurred while updating the user status",
      data: null,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await UserServices.getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Invalid username/email or password",
        data: null,
      });
    }

    const isPasswordValid = await validatePassword(password, user.password);

    if (!isPasswordValid) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Invalid username/email or password",
        data: null,
      });
    }

    const token = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "",
      "20d"
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
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

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await UserServices.getUserProfile(userId);

    if (!user) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "User not found",
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "An error occurred while retrieving the user profile",
      data: null,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await UserServices.getUserById(userId);

    if (!user) {
      return sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const isPasswordValid = await validatePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "Current password is incorrect",
        data: null,
      });
    }

    await UserServices.changePassword(userId, newPassword);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: null,
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

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, email, bio, age, profilePicture } = req.body;

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      await prisma.userProfile.create({
        data: {
          userId,
          bio: bio || null,
          age: age || null,
          profilePicture: profilePicture || null,
        },
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        profile: {
          update: {
            bio: bio || null,
            age: age || null,
            profilePicture: profilePicture || null,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully",
      data: user,
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log(`Attempting to delete user with ID: ${userId}`);

    await UserServices.deleteUser(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error(`Error deleting user with ID: `, error);

    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "An error occurred while deleting the user",
      data: null,
    });
  }
};

export const UserControllers = {
  registerUser,
  loginUser,
  updateUserStatus,
  getUserProfile,
  changePassword,
  updateUserProfile,
  deleteUser,
};
