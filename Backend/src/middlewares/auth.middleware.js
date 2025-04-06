import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.JWT_Token;
    if (!token) {
      const resp = {
        status: "error",
        message: "Unauthorized: No token found",
      };
      res.status(401).json(resp);
      return;
    }
    const secretKey = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      const resp = {
        status: "error",
        message: "Unauthorized: Invalid found",
      };
      res.status(401).json(resp);
      return;
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      const resp = {
        status: "error",
        message: "No user found",
      };
      res.status(404).json(resp);
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
