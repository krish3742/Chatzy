import { X } from "lucide-react";
import { useRef, useState } from "react";

import ProfileModal from "./ProfileModal";
import EditGroupModal from "./EditGroupModal";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { getUserId, getUserName, getUserProfilePic } from "../lib/utils";

const ChatHeader = () => {
  const modalRef = useRef(null);
  const { onlineUsers, authUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedChat, setSelectedChat } = useChatStore();
  const userProfileId = getUserId(selectedChat.users, authUser);
  const userProfileName = getUserName(selectedChat.users, authUser);
  const userProfilePic = getUserProfilePic(selectedChat.users, authUser);

  return (
    <>
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-3 hover:bg-base-300 py-0.5 px-1.5 rounded-sm cursor-pointer"
            onClick={() => {
              modalRef.current.checked = true;
              setIsModalOpen(true);
            }}
          >
            {/* Avatar */}
            <div className="avatar">
              <div className="size-11 rounded-full relative border-2">
                <img
                  src={
                    selectedChat.isGroupChat
                      ? "/avatar.png"
                      : userProfilePic || "/avatar.png"
                  }
                  alt={
                    selectedChat.isGroupChat
                      ? selectedChat.chatName
                      : userProfileName
                  }
                />
              </div>
            </div>

            {/* User info */}
            <div className="text-left">
              <h3 className="font-medium max-w-72 truncate">
                {selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : userProfileName}
              </h3>

              {!selectedChat.isGroupChat && (
                <p className="text-sm text-base-content/70">
                  {onlineUsers.includes(userProfileId) ? "Online" : "Offline"}
                </p>
              )}
            </div>
          </button>

          {/* Close button */}
          <button onClick={() => setSelectedChat(null)}>
            <X className="size-5 text-base-content/40" />
          </button>
        </div>
      </div>

      {/* Profile/Group Modal */}
      <input
        type="checkbox"
        id="my_modal_6"
        className="modal-toggle"
        ref={modalRef}
      />
      <div className="modal" role="dialog">
        <div
          className={`modal-box max-h-[95vh] ${
            selectedChat.isGroupChat ? "overflow-visible" : ""
          }`}
        >
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-1"
            onClick={() => {
              modalRef.current.checked = false;
              setIsModalOpen(false);
            }}
          >
            ✕
          </button>
          <div className="space-y-6">
            <h3 className="text-xl lg:text-2xl text-center font-medium">
              {selectedChat.isGroupChat ? "Edit Group" : "Profile"}
            </h3>
            {/* Avatar */}
            {selectedChat.isGroupChat ? (
              <EditGroupModal isModalOpen={isModalOpen} />
            ) : (
              <ProfileModal />
            )}
          </div>
        </div>

        <label
          className="modal-backdrop"
          htmlFor="my_modal_6"
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </label>
      </div>
    </>
  );
};

export default ChatHeader;
