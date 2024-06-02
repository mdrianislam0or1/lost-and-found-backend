import { z } from "zod";

export const createClaimSchema = z.object({
  foundItemId: z.string().uuid(),
  distinguishingFeatures: z.string().nonempty(),
  lostDate: z.string().nonempty(),
  proofOfPurchase: z.string().optional(),
  photos: z.array(z.string()).optional(),
  ownershipDocs: z.string().optional(),
  detailedLossAccount: z.string().optional(),
  matchingAccessories: z.string().optional(),
  securityFeatures: z.string().optional(),
  thirdPartyConfirmation: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  age: z.number().optional(),
});
