import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

import { useChatStore } from "./useChatStore";
import { get as apiGet, post, put } from "../services/ApiEndpoint";

export const useAuthStore = create((set, get) => ({
  socket: null,
  authUser: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  loggingAsGuest: false,
  isProfileRenaming: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const response = await apiGet("/auth/check");
      set({ authUser: response.data.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const response = await post("/auth/signup", data);
      set({ authUser: response.data.data });
      toast.success("Account created successfully");
      get().connectSocket();
      const { socket } = get();
      if (socket) {
        socket.emit("newUser", response.data.data);
      }
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    if (data.email !== "guest@example.com") {
      set({ isLoggingIn: true });
    } else {
      set({ loggingAsGuest: true });
    }
    try {
      const response = await post("/auth/login", data);
      set({ authUser: response.data.data });
      toast.success("Logged In successfully");
      get().connectSocket();
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isLoggingIn: false });
      set({ loggingAsGuest: false });
    }
  },

  logout: async () => {
    try {
      const response = await apiGet("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      set({ authUser: null });
    }
  },

  updateProfile: async (data) => {
    if (data?.fullName) {
      set({ isProfileRenaming: true });
    } else {
      set({ isUpdatingProfile: true });
    }
    try {
      const response = await put("/auth/update-profile", data);
      const { socket } = get();
      if (socket) {
        socket.emit("userUpdated", response.data.data);
      }
      set({ authUser: response.data.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isUpdatingProfile: false });
      set({ isProfileRenaming: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      return;
    }

    const socket = io(import.meta.env.VITE_BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    const users = useChatStore.getState().users;
    socket.on("newUserRegistered", (newUser) => {
      if (
        users.some((user) => user._id === newUser._id) ||
        authUser._id === newUser._id
      ) {
        return;
      }
      useChatStore.setState({
        users: [...useChatStore.getState().users, newUser],
      });
    });

    socket.on("userProfileUpdated", (userProfile) => {
      const updatedUsers = useChatStore
        .getState()
        .users.map((user) =>
          user._id === userProfile._id ? userProfile : user
        );
      useChatStore.setState({ users: updatedUsers });

      const updatedChats = useChatStore.getState().chats.map((chat) => {
        const updatedUsers = chat.users.map((user) =>
          user._id === userProfile._id ? userProfile : user
        );
        return { ...chat, users: updatedUsers };
      });
      useChatStore.setState({ chats: updatedChats });
    });

    socket.on("newChatCreated", (newChat) => {
      useChatStore.setState({
        chats: [newChat, ...useChatStore.getState().chats],
      });
    });

    const chats = useChatStore.getState().chats;
    socket.on("groupCreated", (newGroup) => {
      if (chats.some((chat) => chat._id === newGroup._id)) {
        return;
      }
      useChatStore.setState({
        chats: [newGroup, ...useChatStore.getState().chats],
      });
    });

    socket.on("groupRenamed", (groupData) => {
      const updatedChats = useChatStore
        .getState()
        .chats.map((chat) => (chat._id === groupData._id ? groupData : chat));

      useChatStore.setState({ chats: updatedChats });
    });

    socket.on("addedUserToGroup", (groupData) => {
      const chats = useChatStore.getState().chats;
      const chatExists = chats.some((chat) => chat._id === groupData._id);

      let updatedChats;

      if (chatExists) {
        updatedChats = chats.map((chat) =>
          chat._id === groupData._id ? groupData : chat
        );
      } else {
        updatedChats = [groupData, ...chats];
      }

      useChatStore.setState({ chats: updatedChats });

      const selectedChat = useChatStore.getState().selectedChat;
      if (selectedChat && selectedChat._id === groupData._id) {
        useChatStore.setState({ selectedChat: groupData });
      }
    });

    socket.on("removedUserFromGroup", (groupData) => {
      const updatedChats = useChatStore
        .getState()
        .chats.map((chat) => (chat._id === groupData._id ? groupData : chat));

      useChatStore.setState({ chats: updatedChats });

      const selectedChat = useChatStore.getState().selectedChat;
      if (selectedChat && selectedChat._id === groupData._id) {
        useChatStore.setState({ selectedChat: groupData });
      }
    });

    socket.on("removedYouFromGroup", (groupData) => {
      const updatedChats = useChatStore
        .getState()
        .chats.filter((chat) => chat._id !== groupData._id);

      useChatStore.setState({ chats: updatedChats });

      const selectedChat = useChatStore.getState().selectedChat;
      if (selectedChat && selectedChat._id === groupData._id) {
        useChatStore.setState({ selectedChat: null });
      }
    });
  },

  disconnectSocket: () => {
    if (get().socket.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
