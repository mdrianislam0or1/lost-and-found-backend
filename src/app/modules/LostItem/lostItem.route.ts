import { Router } from "express";
import { LostItemController } from "./lostItem.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { lostItemSchema, updateLostItemSchema } from "./lostItem.validation";

const router = Router();

router.post("/categories", auth(), LostItemController.createLostItemCategory);

router.get(
  "/categories",
  auth("user", "admin"),
  LostItemController.getLostItemCategories
);

router.post(
  "/",
  auth(),
  validateRequest(lostItemSchema),
  LostItemController.reportLostItem
);
router.get("/", LostItemController.getLostItems);
router.get("/my-items", auth(), LostItemController.getMyLostItems);
router.put(
  "/:id",
  auth(),
  validateRequest(updateLostItemSchema),
  LostItemController.updateLostItem
);
router.delete("/:id", auth(), LostItemController.deleteLostItem);

router.get(
  "/recent-lost-items",
  LostItemController.getRecentlyReportedLostItems
);

router.get(
  "/lostItem/:id",
  auth("user", "admin"),
  LostItemController.getSingleLostItemById
);

router.put(
  "/lostItem/:id",
  auth("user", "admin"),
  LostItemController.updateLostItems
);

export const lostItemRoutes = router;
