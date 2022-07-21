import express from "express";

import { checkMgr } from '../middleware/check-role-mgr.js';

import * as ProductController from "../controllers/product.js"

const router = express.Router();

// DELETE
// Delete one or more products from a location
router.post("/product-delete", checkMgr, ProductController.deleteProduct);

export default router;
