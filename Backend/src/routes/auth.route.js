import express from "express";

import {
  login,
  logout,
  signup,
  checkAuth,
  updateProfile,
} from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signup);

router.post("/login", login);

router.get("/logout", verifyToken, logout);

router.put(
  "/update-profile",
  verifyToken,
  upload.single("profilePic"),
  updateProfile
);

router.get("/check", verifyToken, checkAuth);

export default router;
