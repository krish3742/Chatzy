import { create } from "zustand";
import toast from "react-hot-toast";

import { useAuthStore } from "./useAuthStore";
import { get as apiGet, post, put } from "../services/ApiEndpoint";

export const useChatStore = create((set, get) => ({
  users: [],
  chats: [],
  messages: [],
  selectedChat: null,
  isChatsLoading: false,
  isUsersLoading: false,
  isCreatingGroup: false,
  isGroupRenaming: false,
  isGroupUpdating: false,
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

  getChats: async () => {
    set({ isChatsLoading: true });
    try {
      const response = await apiGet("/message");
      set({ chats: response.data.data });
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isChatsLoading: false });
    }
  },

  getMessages: async () => {
    const { selectedChat } = get();
    if (!selectedChat) {
      return;
    }
    set({ isMessagesLoading: true });
    try {
      const response = await apiGet(`/message/get/${selectedChat._id}`);
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
    const { messages } = get();
    try {
      const response = await post("/message/send", messageData);
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

  accessChat: async (userId) => {
    try {
      const response = await apiGet(`/message/${userId}`);
      get().getChats();
      set({ selectedChat: response.data.data });
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    }
  },

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  createGroup: async (data) => {
    set({ isCreatingGroup: true });
    try {
      const response = await post("/message/group", data);
      get().getChats();
      toast.success("Group created successfully");
      set({ selectedChat: response.data.data });
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isCreatingGroup: false });
    }
  },

  updateGroupName: async (data) => {
    set({ isGroupRenaming: true });
    try {
      const response = await put("/message/rename", data);
      get().getChats();
      set({ selectedChat: response.data.data });
      toast.success("Group name updated successfully");
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isGroupRenaming: false });
    }
  },

  addUserToGroup: async (data) => {
    try {
      const response = await put("/message/groupadd", data);
      set({ selectedChat: response.data.data });
      toast.success("User added successfully");
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    }
  },

  removeUserFromGroup: async (data) => {
    const authUser = useAuthStore.getState().authUser;
    if (data.userId === authUser._id) {
      set({ isGroupUpdating: true });
    }
    try {
      const response = await put("/message/groupremove", data);
      get().getMessages();
      if (data.userId === authUser._id) {
        set({ selectedChat: null });
        get().getChats();
      } else {
        set({ selectedChat: response.data.data });
      }
      toast.success("User removed successfully");
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      if (data.userId === authUser._id) {
        set({ isGroupUpdating: false });
      }
    }
  },
}));
