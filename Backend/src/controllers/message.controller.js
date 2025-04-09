import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../libs/socket.js";

export const getUsers = async (req, res, next) => {
  try {
    const searchedUser = req.query.search;
    const loggedInUserId = req.user._id;
    let filteredUser;
    if (searchedUser) {
      filteredUser = await User.find({
        _id: { $ne: loggedInUserId },
        $or: [
          { fullName: { $regex: searchedUser, $options: "i" } },
          { email: { $regex: searchedUser, $options: "i" } },
        ],
      }).select("-password");
    } else {
      filteredUser = await User.find({
        _id: { $ne: loggedInUserId },
      }).select("-password");
    }
    const resp = {
      status: "success",
      message: "All user fetched",
      data: filteredUser,
    };
    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const userToChatId = req.params.id;
    const loggedInUserId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUserId },
      ],
    });
    const resp = {
      status: "success",
      message: "All messages fetched",
      data: messages,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const receiverId = req.params.id;
    const { text } = req.body;
    if (!req.file && !text) {
      const resp = {
        status: "error",
        message: "At least one field is required",
      };
      res.status(400).json(resp);
      return;
    }
    const updateData = {
      senderId: loggedInUserId,
      receiverId,
      text,
    };
    if (req.file) {
      updateData.image = req.file.path;
    }
    const newMessage = new Message(updateData);
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    const resp = {
      status: "success",
      message: "Message sent",
      data: newMessage,
    };
    res.status(201).json(resp);
  } catch (error) {
    next(error);
  }
};
