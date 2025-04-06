import express from "express";

import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);

export default router;
