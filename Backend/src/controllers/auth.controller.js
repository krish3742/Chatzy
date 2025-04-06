import bcryptjs from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../libs/utils.js";

export const signup = async (req, res, next) => {
  const { email, fullName, password, profilePic } = req.body;
  try {
    if (!fullName || !email || !password) {
      const resp = {
        status: "error",
        message: "All fields are required",
      };
      res.status(400).json(resp);
      return;
    } else if (password.length < 8) {
      const resp = {
        status: "error",
        message: "Password must be at least 8 characters",
      };
      res.status(400).json(resp);
      return;
    }
    const checkUserExists = await User.findOne({ email });
    if (checkUserExists) {
      const resp = {
        status: "error",
        message: "User already exists",
      };
      res.status(409).json(resp);
      return;
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      const resp = {
        status: "success",
        message: "User registered",
      };
      res.status(201).json(resp);
      return;
    } else {
      const resp = {
        status: "error",
        message: "Invalid user data",
      };
      res.status(400).json(resp);
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      const resp = {
        status: "error",
        message: "All fields are required",
      };
      res.status(400).json(resp);
      return;
    }
    const checkUserExists = await User.findOne({ email });
    if (checkUserExists) {
      const checkPassword = await bcryptjs.compare(
        password,
        checkUserExists.password
      );
      if (checkPassword) {
        generateToken(checkUserExists._id, res);
        const resp = {
          status: "success",
          message: "Login successful",
        };
        res.status(200).json(resp);
        return;
      } else {
        const resp = {
          status: "error",
          message: "Invalid credentials",
        };
        res.status(401).json(resp);
        return;
      }
    } else {
      const resp = {
        status: "error",
        message: "Invalid credentials",
      };
      res.status(401).json(resp);
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    res.cookie("JWT_Token", "", {
      maxAge: 0,
    });
    const resp = {
      status: "success",
      message: "Logout successful",
    };
    res.status(200).json(resp);
    return;
  } catch (error) {
    next(error);
  }
};
