import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.route.js";

const app = express();
dotenv.config();

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
const connectionString = process.env.MONGODB_URI;

(async () => {
  try {
    await mongoose.connect(connectionString);
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
