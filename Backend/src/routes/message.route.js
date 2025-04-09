import express from "express";

import {
  getUsers,
  fetchChats,
  accessChat,
  addToGroup,
  sendMessage,
  createGroup,
  renameGroup,
  removeFromGroup,
} from "../controllers/message.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);

router.get("/", verifyToken, fetchChats);

router.get("/:id", verifyToken, accessChat);

router.post("/group", verifyToken, createGroup);

router.put("/rename", verifyToken, renameGroup);

router.put("/groupremove", verifyToken, removeFromGroup);

router.put("/groupadd", verifyToken, addToGroup);

router.post("/send/:id", verifyToken, upload.single("image"), sendMessage);

export default router;
