import express from "express";

import { checkAuth } from "../middleware/check-auth.js";

import * as LocationController from "../controllers/location.js";

const router = express.Router();

// LOCATIONS
// Fetch all locations where iser is autorized
router.get(
  "/fetch-user-locations/:userId/:userRole",
  checkAuth,
  LocationController.fetchUserLocations
);

// PRODUCTS
// Create new product for location
router.post("/new-product", checkAuth, LocationController.createProduct);
// Update product for location
router.put("/update-product", checkAuth, LocationController.updateProduct);

// INVENTORY
// Start new inventory
router.post("/new-inventory", checkAuth, LocationController.createInventory);

// Update existing inventory
router.put("/update-inventory", checkAuth, LocationController.updateInventory);

// Fetch all inventories of the parentOrg
router.get(
  "/fetch-location-inventories/:locationId",
  checkAuth,
  LocationController.fetchLocationInventories
);

export default router;
