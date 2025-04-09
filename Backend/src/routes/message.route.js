import express from "express";

import {
  getUsers,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);

router.get("/:id", verifyToken, getMessages);

router.post("/send/:id", verifyToken, upload.single("image"), sendMessage);

export default router;
