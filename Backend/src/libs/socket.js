import http from "http";
import dotenv from "dotenv";
import express from "express";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: [process.env.CORS_ORIGIN_URL],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("newUser", (user) => {
    io.emit("newUserRegistered", user);
  });

  socket.on("joinChat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (data) => {
    socket.in(data.chatId).emit("typing", data.user);
  });

  socket.on("stopTyping", (chatId) => {
    socket.in(chatId).emit("stopTyping");
  });

  socket.on("newMessage", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat.users) {
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessage.senderId._id) {
        return;
      }
      const receiverSocketId = userSocketMap[user._id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageRecieved", newMessage);
      }
    });
  });

  socket.on("newGroup", (newGroup) => {
    const users = newGroup.users;
    if (!users) {
      return;
    }

    users.forEach((user) => {
      if (user._id === newGroup.groupAdmin._id) {
        return;
      }
      const receiverSocketId = userSocketMap[user._id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("groupCreated", newGroup);
      }
    });
  });

  socket.on("groupNameUpdated", (data) => {
    const users = data.groupData.users;
    if (!users) {
      return;
    }

    users.forEach((user) => {
      if (user._id === data.userId) {
        return;
      }
      const receiverSocketId = userSocketMap[user._id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("groupRenamed", data.groupData);
      }
    });
  });

  socket.on("groupUserAdded", (groupData) => {
    const users = groupData.users;
    if (!users) {
      return;
    }

    users.forEach((user) => {
      if (user._id === groupData.groupAdmin._id) {
        return;
      }
      const receiverSocketId = userSocketMap[user._id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("addedUserToGroup", groupData);
      }
    });
  });

  socket.on("groupUserRemoved", (data) => {
    const users = data.groupData.users;
    if (!users) {
      return;
    }

    users.forEach((user) => {
      if (user._id === data.loggedUser) {
        return;
      }
      const receiverSocketId = userSocketMap[user._id];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("removedUserFromGroup", data.groupData);
      }
    });

    if (data.removedUserId !== data.loggedUser) {
      const receiverSocketId = userSocketMap[data.removedUserId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("removedYouFromGroup", data.groupData);
      }
    }
  });
});

export { io, app, server };
