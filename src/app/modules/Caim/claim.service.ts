import prisma from "../../shared/prisma";
import { Claim, Status, User, UserProfile } from "@prisma/client";

const createClaim = async (
  userId: string,
  foundItemId: string,
  distinguishingFeatures: string,
  lostDate: Date,
  proofOfPurchase?: string,
  photos?: string[],
  ownershipDocs?: string,
  detailedLossAccount?: string,
  matchingAccessories?: string,
  securityFeatures?: string,
  thirdPartyConfirmation?: string
): Promise<Claim> => {
  const claim = await prisma.claim.create({
    data: {
      userId,
      foundItemId,
      distinguishingFeatures,
      lostDate,
      proofOfPurchase,
      photos: photos || [],
      ownershipDocs,
      detailedLossAccount,
      matchingAccessories,
      securityFeatures,
      thirdPartyConfirmation,
    },
  });

  return claim;
};

const getClaims = async (): Promise<Claim[]> => {
  const claims = await prisma.claim.findMany({
    include: {
      foundItem: {
        include: {
          user: true,
          category: true,
        },
      },
    },
  });

  return claims;
};

const updateClaimStatus = async (
  claimId: string,
  status: string
): Promise<Claim> => {
  const updatedClaim = await prisma.claim.update({
    where: {
      id: claimId,
    },
    data: {
      status,
    },
  });

  return updatedClaim;
};

const getUserClaims = async (userId: string): Promise<Claim[]> => {
  const claims = await prisma.claim.findMany({
    where: { userId },
    include: {
      foundItem: {
        include: {
          user: true,
          category: true,
        },
      },
    },
  });

  return claims;
};

const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const profile = await prisma.userProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });

  return profile;
};

const updateProfile = async (
  userId: string,
  profileData: { name?: string; email?: string; bio?: string; age?: number }
): Promise<UserProfile | null> => {
  const updatedProfile = await prisma.userProfile.update({
    where: {
      userId,
    },
    data: {
      bio: profileData.bio,
      age: profileData.age,
      user: {
        update: {
          name: profileData.name,
          email: profileData.email,
        },
      },
    },
    include: {
      user: true,
    },
  });

  return updatedProfile;
};

const deleteClaim = async (claimId: string): Promise<Claim | null> => {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      foundItem: true,
      lostItem: true,
    },
  });

  if (!claim) {
    throw new Error("Claim not found");
  }

  if (claim.foundItem) {
    await prisma.foundItem.delete({
      where: { id: claim.foundItem.id },
    });
  }

  if (claim.lostItem) {
    await prisma.lostItem.delete({
      where: { id: claim.lostItem.id },
    });
  }
  const deletedClaim = await prisma.claim.delete({
    where: { id: claimId },
  });

  return deletedClaim;
};

const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany({
    include: {
      profile: true,
    },
  });
};

const updateUserStatus = async (
  userId: string,
  status: Status
): Promise<User> => {
  return await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
};

const getWebsiteMetrics = async () => {
  const totalNumberOfReportedItems =
    (await prisma.foundItem.count()) + (await prisma.lostItem.count());

  const totalNumberOfLostItems = await prisma.lostItem.count();
  const numberOfClaims = await prisma.claim.count();
  const numberOfFoundItems = await prisma.lostItem.count({
    where: { isFound: true },
  });

  return {
    totalNumberOfReportedItems,
    totalNumberOfLostItems,
    numberOfClaims,
    numberOfFoundItems,
  };
};
export const ClaimServices = {
  createClaim,
  getClaims,
  updateClaimStatus,
  getUserClaims,
  getProfile,
  updateProfile,
  deleteClaim,
  getAllUsers,
  updateUserStatus,
  getWebsiteMetrics,
};
