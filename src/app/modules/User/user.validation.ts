import { object, string, number, nativeEnum } from "zod";
import { Role, Status } from "@prisma/client";

export const userProfileSchema = object({
  bio: string().optional(),
  age: number().int().optional(),
  profilePicture: string().url().optional(),
});

export const registerUserSchema = object({
  name: string(),
  email: string().email(),
  password: string(),
  confirmPassword: string(),
  profile: userProfileSchema.optional(),
  role: nativeEnum(Role).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginUserSchema = object({
  usernameOrEmail: string(),
  password: string(),
});

export const updateUserStatusSchema = object({
  userId: string(),
  status: nativeEnum(Status),
});

export const changePasswordSchema = object({
  currentPassword: string(),
  newPassword: string(),
  confirmNewPassword: string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

export const updateUserProfileSchema = object({
  name: string().optional(),
  email: string().email().optional(),
  bio: string().optional(),
  age: number().int().min(0).optional(),
  profilePicture: string().url().optional(),
});
