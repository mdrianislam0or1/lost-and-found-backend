import bcrypt from "bcrypt";
import { PrismaClient, Role, Status } from "@prisma/client";

const prisma = new PrismaClient();

const registerUser = async (
  name: string,
  email: string,
  password: string,
  profile: any,
  role: Role = Role.user
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        create: {
          bio: profile?.bio || null,
          age: profile?.age || null,
          profilePicture: profile?.profilePicture || null,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  return user;
};

const updateUserProfile = async (
  userId: string,
  updates: {
    name?: string;
    email?: string;
    bio?: string;
    age?: number;
    profilePicture?: string;
  }
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: updates.name,
      email: updates.email,
      profile: {
        update: {
          bio: updates.bio,
          age: updates.age,
          profilePicture: updates.profilePicture,
        },
      },
    },
    include: {
      profile: true,
    },
  });
  return user;
};

const getUserByUsernameOrEmail = async (usernameOrEmail: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: usernameOrEmail }, { name: usernameOrEmail }],
    },
  });

  return user;
};

const updateUserStatus = async (userId: string, status: Status) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return user;
};

const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      lostItems: true,
      claims: true,
    },
  });

  return user;
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
};

const changePassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

export const UserServices = {
  registerUser,
  getUserByUsernameOrEmail,
  updateUserStatus,
  getUserProfile,
  getUserById,
  updateUserProfile,
  changePassword,
};
