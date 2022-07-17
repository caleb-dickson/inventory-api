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

// PASSWORD RESET
// Find by email and send the reset link
router.post("/reset-pass-init", UserController.resetPassInit);
// After link landing, verify the link is still valid
router.get("/reset-pass-init/:token", UserController.checkPassResetToken);
// Update the User's password
router.put("/reset-pass", UserController.resetPass);

export default router;
