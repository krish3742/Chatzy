import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

import { get as apiGet, post, put } from "../services/ApiEndpoint";

export const useAuthStore = create((set, get) => ({
  socket: null,
  authUser: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
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
    set({ isLoggingIn: true });
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
    set({ isUpdatingProfile: true });
    try {
      const response = await put("/auth/update-profile", data);
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
  },

  disconnectSocket: () => {
    if (get().socket.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
