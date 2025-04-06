import User from "../models/user.model.js";
import cloudinary from "../libs/cloudinary.js";
import Message from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    const resp = {
      status: "success",
      message: "All user fetched",
      data: filteredUser,
    };
    res.status(200).json(resp);
  } catch (error) {
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
    const { text, image } = req.body;
    const updateData = {
      senderId: loggedInUserId,
      receiverId,
      text,
    };
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.image = uploadResponse.secure_url;
    }
    const newMessage = new Message(updateData);
    await newMessage.save();
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
