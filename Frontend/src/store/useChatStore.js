import { create } from "zustand";
import toast from "react-hot-toast";

import { useAuthStore } from "./useAuthStore";
import { get as apiGet, post, put } from "../services/ApiEndpoint";

export const useChatStore = create((set, get) => ({
  users: [],
  chats: [],
  messages: [],
  notifications: [],
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
      const socket = useAuthStore.getState().socket;
      socket.emit("joinChat", selectedChat._id);
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
      const socket = useAuthStore.getState().socket;
      socket.emit("newMessage", response.data.data);
    } catch (error) {
      if (error.status === 500) {
        toast.error("Something went wrong!");
      } else {
        toast.error(error.response.data.message);
      }
    }
  },

  listenMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket.off("messageRecieved");

    socket.on("messageRecieved", (newMessage) => {
      const { selectedChat, messages, notifications, getChats } = get();

      if (selectedChat && selectedChat._id === newMessage.chat._id) {
        set({ messages: [...messages, newMessage] });
      } else {
        const alreadyNotified = notifications.some(
          (notification) => notification._id === newMessage._id
        );
        if (!alreadyNotified) {
          set({ notifications: [newMessage, ...notifications] });
          getChats();
        }
      }
    });
  },

  accessChat: async (userId) => {
    set({ isChatsLoading: true });
    try {
      const response = await apiGet(`/message/${userId}`);
      const { chats } = get();
      if (!chats.find((chat) => chat._id === response.data.data._id)) {
        set({ chats: [response.data.data, ...chats] });
      }
      set({ selectedChat: response.data.data });
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

  createGroup: async (data) => {
    set({ isCreatingGroup: true });
    try {
      const response = await post("/message/group", data);
      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("newGroup", response.data.data);
      }
      set({ chats: [response.data.data, ...get().chats] });
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
      const socket = useAuthStore.getState().socket;
      const authUser = useAuthStore.getState().authUser;
      if (socket) {
        socket.emit("groupNameUpdated", {
          groupData: response.data.data,
          userId: authUser._id,
        });
      }
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
      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("groupUserAdded", response.data.data);
      }
      get().getChats();
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
      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("groupUserRemoved", {
          groupData: response.data.data,
          removedUserId: data.userId,
          loggedUser: authUser._id,
        });
      }
      get().getChats();
      get().getMessages();
      if (data.userId === authUser._id) {
        set({ selectedChat: null });
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

  setSelectedChat: (chat) => {
    if (chat && chat._id) {
      localStorage.setItem("chat-id", chat._id);
    } else {
      localStorage.removeItem("chat-id");
    }

    const { notifications } = get();

    const filteredNotifications = notifications.filter(
      (notification) => notification.chat._id !== chat?._id
    );

    set({ selectedChat: chat, notifications: filteredNotifications });
  },

  filterNotification: (notification) => {
    set({
      notifications: get().notifications.filter(
        (prevNotification) => prevNotification !== notification
      ),
    });
  },
}));
