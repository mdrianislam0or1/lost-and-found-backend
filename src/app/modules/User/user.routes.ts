import express from "express";
import validateRequest from "../../middleware/validateRequest";
import {
  registerUserSchema,
  loginUserSchema,
  updateUserStatusSchema,
  changePasswordSchema,
  updateUserProfileSchema,
} from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  UserControllers.registerUser
);

router.post(
  "/login",
  validateRequest(loginUserSchema),
  UserControllers.loginUser
);

router.patch(
  "/status",
  auth("admin"),
  validateRequest(updateUserStatusSchema),
  UserControllers.updateUserStatus
);

router.get("/profile", auth("user", "admin"), UserControllers.getUserProfile);

router.patch(
  "/change-password",
  auth("user", "admin"),
  validateRequest(changePasswordSchema),
  UserControllers.changePassword
);

router.patch(
  "/profile",
  auth("user", "admin"),
  validateRequest(updateUserProfileSchema),
  UserControllers.updateUserProfile
);

export const userRoutes = router;
