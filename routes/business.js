import express from 'express';

import { checkAuth } from '../middleware/check-auth.js';
import { checkOwner } from '../middleware/check-role-owner.js';
import { checkMgr } from '../middleware/check-role-mgr.js';

import * as BusinessController from "../controllers/business.js";

const router = express.Router();

// BUSINESS
// Create new business = DONE
router.post(
  "/create-business",
  checkAuth,
  checkOwner,
  BusinessController.createBusiness
);
// Update business name = DONE
router.put(
  "/update-business/",
  checkAuth,
  checkOwner,
  BusinessController.updateBusiness
);
// Fetch owner's business = DONE
router.get(
  "/fetch-business/:ownerId",
  checkAuth,
  checkOwner,
  BusinessController.getOwnersBusiness
);

// LOCATIONS
// Create new location = DONE
router.post(
  "/create-location",
  checkAuth,
  checkOwner,
  BusinessController.createLocation
);
// Fetch all locations docs for business = DONE
router.get(
  "/fetch-business-locations/:businessId",
  checkAuth,
  checkOwner,
  BusinessController.getBusinessLocations
);

// Update one location = DONE
router.put(
  "/update-location",
  checkAuth,
  checkMgr,
  BusinessController.updateLocation
);
// Add managers to location = DONE
router.put(
  "/add-location-users",
  checkAuth,
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
