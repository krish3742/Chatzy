import { create } from "zustand";
import toast from "react-hot-toast";

import { useAuthStore } from "./useAuthStore";
import { get as apiGet, post } from "../services/ApiEndpoint";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedChat: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await apiGet("/message/users");
      set({ users: response.data.data });
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await apiGet(`/message/${userId}`);
      set({ messages: response.data.data });
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const response = await post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, response.data.data] });
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    }
  },

  listenMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) {
      return;
    }
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) {
        return;
      }
      set({ messages: [...get().messages, newMessage] });
    });
  },

  ignoreMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedChat: async (userId) => {
    try {
      const response = await apiGet(`/message/${userId}`);
      set({ selectedChat: response.data.data });
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    }
  },
}));
