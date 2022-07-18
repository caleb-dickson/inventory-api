import express from "express";

import { checkAuth } from "../middleware/check-auth.js";
import saveUserPhoto from "../middleware/saveUserPhoto.js";

import * as UserController from "../controllers/user.js";

const router = express.Router();

router.post("/signup", UserController.signup);

router.post("/login", UserController.login);

// Fetch all locations where user is authorized
router.get(
  "/user-locations/:userId/:userRole",
  checkAuth,
  UserController.getUserLocations
);

router.put("/user", checkAuth, saveUserPhoto, UserController.updateUser);

// PASSWORD RESET
// Find by email and send the reset link
router.post("/reset", UserController.resetPassInit);
// After link landing, verify the link is still valid
router.get("/reset/:token", UserController.checkPassResetToken);
// Update the User's password
router.put("/reset", UserController.resetPass);

// DELETE USER
router.delete("/user/:userId", checkAuth, UserController.deleteUser);

export default router;
