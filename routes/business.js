import express from "express";

import { checkOwner } from "../middleware/check-role-owner.js";
import { checkMgr } from "../middleware/check-role-mgr.js";
import saveBizPhoto from "../middleware/saveBizPhoto.js";

import * as BusinessController from "../controllers/business.js";

const router = express.Router();

// BUSINESS
// Create new business
router.post(
  "/create-business",
  checkOwner,
  saveBizPhoto,
  BusinessController.createBusiness
);
// Update business name
router.put(
  "/update-business/",
  checkOwner,
  saveBizPhoto,
  BusinessController.updateBusiness
);
// Fetch owner's business
router.get(
  "/fetch-business/:ownerId",
  checkOwner,
  BusinessController.getOwnersBusiness
);

// LOCATIONS
// Create new location
router.post("/create-location", checkOwner, BusinessController.createLocation);

// Fetch all locations docs for business
router.get(
  "/fetch-business-locations/:businessId",
  checkOwner,
  BusinessController.getBusinessLocations
);

// Update one location
router.put("/update-location", checkMgr, BusinessController.updateLocation);
// Add managers to location
router.put(
  "/add-location-users",
  checkOwner,
  BusinessController.addUsersToLocation
);

export default router;
