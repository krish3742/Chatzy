import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../libs/socket.js";
import Chat from "../models/chat.model.js";

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

export const accessChat = async (req, res, next) => {
  try {
    const userToChatId = req.params.id;
    const loggedInUserId = req.user._id;

    let isChatExists = await Chat.find({
      isGroupChat: false,
      $and: [
        {
          users: {
            $elemMatch: { $eq: loggedInUserId },
          },
        },
        {
          users: {
            $elemMatch: { $eq: userToChatId },
          },
        },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChatExists = await User.populate(isChatExists, {
      path: "latestMessage.senderId",
      select: "fullName email profilePic",
    });

    if (isChatExists.length > 0) {
      const resp = {
        status: "success",
        message: "Chats fetched",
        data: isChatExists[0],
      };
      res.status(200).json(resp);
      return;
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [loggedInUserId, userToChatId],
    };

    const newChat = new Chat(chatData);
    await newChat.save();

    const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
      "users",
      "-password"
    );

    const resp = {
      status: "success",
      message: "Chats fetched",
      data: fullChat,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};

export const fetchChats = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;

    let chat = await Chat.find({
      users: { $elemMatch: { $eq: loggedInUserId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chat = await User.populate(chat, {
      path: "latestMessage.senderId",
      select: "fullName email profilePic",
    });

    const resp = {
      status: "success",
      message: "All chats fetched",
      data: chat,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const { users, name } = req.body;
    if (!users || !name) {
      const resp = {
        status: "error",
        message: "All fields are required",
      };
      res.status(400).json(resp);
      return;
    }

    const formatUsers = JSON.parse(users);
    formatUsers.push(req.user._id);

    const newGroup = new Chat({
      chatName: name,
      users: formatUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    await newGroup.save();

    const groupChat = await Chat.findOne({ _id: newGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    const resp = {
      status: "success",
      message: "New group created",
      data: groupChat,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};

export const addToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    const loggedInUserId = req.user._id;

    if (!chatId || !userId) {
      const resp = {
        status: "error",
        message: "All fields are required",
      };
      res.status(400).json(resp);
      return;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      const resp = {
        status: "error",
        message: "No chat found",
      };
      res.status(404).json(resp);
      return;
    }

    if (!chat.isGroupChat) {
      const resp = {
        status: "error",
        message: "User can only be added to group chat",
      };
      res.status(403).json(resp);
      return;
    }

    const isLoggedInUserAdmin =
      chat.groupAdmin.toString() === loggedInUserId.toString();

    if (!isLoggedInUserAdmin) {
      const resp = {
        status: "error",
        message: "Only admin can add users",
      };
      res.status(403).json(resp);
      return;
    }

    const isUserPartOfChat = chat.users.some(
      (userID) => userID.toString() === userId
    );

    if (isUserPartOfChat) {
      const resp = {
        status: "error",
        message: "User is already in the group",
      };
      res.status(403).json(resp);
      return;
    }

    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    const resp = {
      status: "success",
      message: "User added",
      data: addUser,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};

export const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    const loggedInUserId = req.user._id;

    if (!chatId || !userId) {
      const resp = {
        status: "error",
        message: "All fields are required",
      };
      res.status(400).json(resp);
      return;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      const resp = {
        status: "error",
        message: "No chat found",
      };
      res.status(404).json(resp);
      return;
    }

    if (!chat.isGroupChat) {
      const resp = {
        status: "error",
        message: "User can only be removed from group chat",
      };
      res.status(403).json(resp);
      return;
    }

    const isLoggedInUserAdmin =
      chat.groupAdmin.toString() === loggedInUserId.toString();

    if (!isLoggedInUserAdmin) {
      const resp = {
        status: "error",
        message: "Only admin can remove users",
      };
      res.status(403).json(resp);
      return;
    }

    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    const resp = {
      status: "success",
      message: "User removed",
      data: removeUser,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};

export const renameGroup = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      const resp = {
        status: "error",
        message: "All fields are required",
      };
      res.status(400).json(resp);
      return;
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      const resp = {
        status: "error",
        message: "No chat found",
      };
      res.status(404).json(resp);
      return;
    }

    if (!chat.isGroupChat) {
      const resp = {
        status: "error",
        message: "Only group chats can be renamed",
      };
      res.status(403).json(resp);
      return;
    }

    const isUserPartOfChat = chat.users.some(
      (userId) => userId.toString() === loggedInUserId.toString()
    );

    if (!isUserPartOfChat) {
      const resp = {
        status: "error",
        message: "You are not a member of this group chat",
      };
      res.status(403).json(resp);
      return;
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    const resp = {
      status: "success",
      message: "Chat updated",
      data: updatedChat,
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
