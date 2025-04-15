import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import createHttpError from "http-errors";

import { server, app } from "./libs/socket.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import clearBlacklistedTokenScheduler from "./libs/clearBlacklistedTokenScheduler.js";

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: `${process.env.CORS_ORIGIN_URL}`, credentials: true }));

app.get("/", (req, res, next) => {
  res.send("Welcome");
});

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT || 3000;
const connectionString = process.env.MONGODB_URI;

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status).json(error.message);
});

clearBlacklistedTokenScheduler;

(async () => {
  try {
    await mongoose.connect(connectionString);
    server.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
