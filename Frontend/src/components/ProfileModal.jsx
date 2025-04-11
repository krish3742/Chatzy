import { Mail, User } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { getUserName, getUserEmail, getUserProfilePic } from "../lib/utils";

const ProfileModal = () => {
  const { authUser } = useAuthStore();
  const { selectedChat } = useChatStore();
  const userProfileName = getUserName(selectedChat.users, authUser);
  const userProfileEmail = getUserEmail(selectedChat.users, authUser);
  const userProfilePic = getUserProfilePic(selectedChat.users, authUser);

  return (
    <>
      <div className="flex justify-center">
        <img
          src={userProfilePic || "/avatar.png"}
          alt={userProfileName}
          className="size-32 rounded-full object-cover border-4"
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </div>
          <p className="px-4 py-2.5 bg-base-200 rounded-lg border break-all">
            {userProfileName}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </div>
          <p className="px-4 py-2.5 bg-base-200 rounded-lg border break-all">
            {userProfileEmail}
          </p>
        </div>
      </div>
      <div className="bg-base-200 border rounded-xl p-6">
        <h2 className="text-lg font-medium  mb-4">Account Information</h2>
        <div className="text-sm">
          <div className="flex items-center justify-between py-2 border-b border-zinc-700">
            <span>Member Since</span>
            <span>{selectedChat.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Account Status</span>
            <span className="text-green-500">Active</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
