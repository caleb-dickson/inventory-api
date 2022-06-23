import express from "express";

import { checkAuth } from "../middleware/check-auth.js";
import saveUserPhoto from "../middleware/saveUserPhoto.js";

import * as UserController from "../controllers/user.js";

const router = express.Router();

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);

// Fetch all locations where user is authorized
router.get(
  "/fetch-user-locations/:userId/:userRole",
  checkAuth,
  UserController.getUserLocations
);

router.put("/update-user", checkAuth, saveUserPhoto, UserController.updateUser);

export default router;
