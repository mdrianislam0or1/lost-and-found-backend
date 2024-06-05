import express from "express";
import { FoundItemController } from "./foundItem.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post(
  "/found-item-categories",
  auth(),
  FoundItemController.createFoundItemCategory
);

router.get(
  "/found-item-categories",
  auth("user", "admin"),
  FoundItemController.getFoundItemCategories
);

router.post(
  "/found-items",
  auth("user", "admin"),
  FoundItemController.reportFoundItem
);

router.get(
  "/found-items",
  // auth("admin", "user"),
  FoundItemController.getFoundItems
);

router.get("/my-found-items", auth(), FoundItemController.getMyFoundItems);

router.get(
  "/recently-reported-found-items",
  FoundItemController.getRecentlyReportedFoundItems
);

router.put("/found-items/:itemId", auth(), FoundItemController.updateFoundItem);

router.get(
  "/found-items/:itemId",
  auth("admin", "user"),
  FoundItemController.getSingleFoundItemById
);

router.delete(
  "/found-items/:itemId",
  // auth("admin"),
  FoundItemController.deleteFoundItem
);

export const foundItemRoutes = router;
