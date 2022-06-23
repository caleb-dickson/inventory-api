import express from 'express';

import { checkAuth } from '../middleware/check-auth.js';
import { checkOwner } from '../middleware/check-role-owner.js';
import { checkMgr } from '../middleware/check-role-mgr.js';

import saveBizPhoto from "../middleware/saveBizPhoto.js";

import * as BusinessController from "../controllers/business.js";

const router = express.Router();

// BUSINESS
// Create new business = DONE
router.post(
  "/create-business",
  checkOwner,
  saveBizPhoto,
  BusinessController.createBusiness
);
// Update business name = DONE
router.put(
  "/update-business/",
  checkOwner,
  saveBizPhoto,
  BusinessController.updateBusiness
);
// Fetch owner's business = DONE
router.get(
  "/fetch-business/:ownerId",
  checkOwner,
  BusinessController.getOwnersBusiness
);

// LOCATIONS
// Create new location = DONE
router.post(
  "/create-location",
  checkOwner,
  BusinessController.createLocation
);
// Fetch all locations docs for business = DONE
router.get(
  "/fetch-business-locations/:businessId",
  checkOwner,
  BusinessController.getBusinessLocations
);

// Update one location = DONE
router.put(
  "/update-location",
  checkMgr,
  BusinessController.updateLocation
);
// Add managers to location = DONE
router.put(
  "/add-location-users",
  checkOwner,
  BusinessController.addUsersToLocation
);

// INVENTORY
// Fetch all inventories for location = NEED
// router.get(
//   "/fetch-inventory/:locationId",
//   checkAuth,
//   checkMgr,
//   BusinessController.getInventories
// );

export default router;
