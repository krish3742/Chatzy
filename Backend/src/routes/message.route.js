import express from "express";

import {
  getAllUsers,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);

router.get("/:id", verifyToken, getMessages);

router.post("/send/:id", verifyToken, sendMessage);

export default router;
