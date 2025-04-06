import express from "express";

import {
  login,
  logout,
  signup,
  checkAuth,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", verifyToken, logout);

router.put("/update-profile", verifyToken, updateProfile);

router.get("/check", verifyToken, checkAuth);

export default router;
