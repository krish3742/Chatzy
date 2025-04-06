import express from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllUsers, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);

router.get("/:id", verifyToken, getMessages);

export default router;
