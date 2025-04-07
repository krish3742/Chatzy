import bcryptjs from "bcryptjs";

import User from "../models/user.model.js";
import cloudinary from "../libs/cloudinary.js";
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
    const updateData = {
      fullName,
      email,
      password: hashedPassword,
    };
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }
    const newUser = new User(updateData);
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      const { password, ...userWithoutPassword } = newUser._doc;
      const resp = {
        status: "success",
        message: "User registered",
        data: userWithoutPassword,
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
        const { password, ...userWithoutPassword } = checkUserExists._doc;
        const resp = {
          status: "success",
          message: "Login successful",
          data: userWithoutPassword,
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
    res.clearCookie("JWT_Token");
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

export const updateProfile = async (req, res, next) => {
  const { profilePic, fullName } = req.body;
  try {
    const userId = req.user._id;
    if (!profilePic && !fullName) {
      const resp = {
        status: "error",
        message: "At least one field is required",
      };
      res.status(400).json(resp);
      return;
    }
    const updateData = {};
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }
    if (fullName) {
      updateData.fullName = fullName;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");
    if (!updatedUser) {
      const resp = {
        status: "error",
        message: "No user found",
      };
      res.status(404).json(resp);
      return;
    }
    const resp = {
      status: "success",
      message: "User updated",
      data: updatedUser,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};

export const checkAuth = (req, res, next) => {
  try {
    const resp = {
      status: "success",
      message: "User authenticated",
      data: req.user,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};
