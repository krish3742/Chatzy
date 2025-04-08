import { create } from "zustand";
import toast from "react-hot-toast";

import { get, post, put } from "../services/ApiEndpoint";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const response = await get("/auth/check");
      set({ authUser: response.data.data });
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
      const response = await get("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
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
}));
