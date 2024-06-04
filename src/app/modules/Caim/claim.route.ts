import express from "express";
import { ClaimController } from "./claim.controller";
import auth from "../../middleware/auth";
import { createClaimSchema, updateProfileSchema } from "./claim.validation";
import validateRequest from "../../middleware/validateRequest";

const router = express.Router();

router.post(
  "/claims",
  auth(),
  validateRequest(createClaimSchema),
  ClaimController.createClaim
);

router.get("/claims", auth(), ClaimController.getClaims);

router.get("/my-claims", auth(), ClaimController.getMyClaims);

router.put("/claims/:claimId", auth(), ClaimController.updateClaimStatus);

router.get("/my-profile", auth("user", "admin"), ClaimController.getProfile);
router.put(
  "/my-profile",
  auth("user", "admin"),
  validateRequest(updateProfileSchema),
  ClaimController.updateMyProfile
);

router.delete("/claims/:claimId", auth("admin"), ClaimController.deleteClaim);

router.get("/users", auth("admin"), ClaimController.getAllUsers);
router.put(
  "/users/:userId/status",
  auth("admin"),
  ClaimController.updateUserStatus
);
router.get(
  "/website-metrics",
  auth("admin"),
  ClaimController.getWebsiteMetrics
);

export const claimRoutes = router;
