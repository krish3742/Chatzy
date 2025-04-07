import { create } from "zustand";
import { get } from "../services/ApiEndpoint";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  checkAuth: async () => {
    try {
      const response = await get("/auth/check");
      console.log(response);
      set({ authUser: response.data.data });
    } catch (error) {
      set({ authUser: null });
      console.log("Error check auth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
