import { useEffect } from "react";
import { MessagesSquare } from "lucide-react";

import NewGroupModal from "./NewGroupModal";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { getUserId, getUserName, getUserProfilePic } from "../lib/utils";

const Sidebar = () => {
  const { onlineUsers, authUser } = useAuthStore();
  const { getChats, chats, isChatsLoading, setSelectedChat, selectedChat } =
    useChatStore();

  useEffect(() => {
    getChats();
  }, [getChats]);

  return (
    <aside className="h-full border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <MessagesSquare className="size-6" />
          <span className="font-medium sm:hidden md:inline">Chats</span>
        </div>
        <NewGroupModal />
      </div>

      <div className="overflow-y-auto flex flex-col gap-1 w-full">
        {isChatsLoading ? (
          <SidebarSkeleton />
        ) : chats && chats.length === 0 ? (
          <div className="w-full text-center p-2">
            <span className="font-medium">
              Select user from contacts to chat
            </span>
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedChat?._id === chat._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={
                    chat.isGroupChat
                      ? "/avatar.png"
                      : getUserProfilePic(chat.users, authUser) || "/avatar.png"
                  }
                  alt={
                    chat.isGroupChat
                      ? chat.chatName
                      : getUserName(chat.users, authUser)
                  }
                  className="size-12 object-cover rounded-full border-2"
                />
                {!chat.isGroupChat &&
                  onlineUsers.includes(getUserId(chat.users, authUser)) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
              </div>

              <div className="text-left min-w-0">
                <div className="font-medium truncate">
                  {chat.isGroupChat
                    ? chat.chatName
                    : getUserName(chat.users, authUser)}
                </div>
                <div className="text-sm text-zinc-400">
                  {/* {onlineUsers.includes(user._id) ? "Online" : "Offline"} */}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
