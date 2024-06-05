import { Router } from "express";
import { LostItemController } from "./lostItem.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import {
  lostItemSchema,
  updateIsFoundSchema,
  updateLostItemSchema,
} from "./lostItem.validation";

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
router.get(
  "/recent-lost-items",
  LostItemController.getRecentlyReportedLostItems
);

router.get(
  "/:id",
  auth("user", "admin"),
  LostItemController.getSingleLostItemById
);

router.put(
  "/:id",
  //  auth("user", "admin"),
  LostItemController.updateLostItem
);

router.delete(
  "/:id",
  // auth("user", "admin"),
  LostItemController.deleteLostItem
);

router.patch(
  "/is-found/:id",
  // auth("user", "admin"),
  validateRequest(updateIsFoundSchema),
  LostItemController.updateIsFound
);

export const lostItemRoutes = router;
