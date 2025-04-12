import toast from "react-hot-toast";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  X,
  Check,
  Pencil,
  UserPen,
  Loader2,
  UserRoundPlus,
} from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const EditGroupModal = ({ isModalOpen }) => {
  const {
    users,
    selectedChat,
    addUserToGroup,
    updateGroupName,
    isGroupUpdating,
    isGroupRenaming,
    removeUserFromGroup,
  } = useChatStore();
  const inputRef = useRef(null);
  const { authUser } = useAuthStore();
  const [search, setSearch] = useState("");
  const [editName, setEditName] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState(selectedChat.chatName);
  const [dropdownDirection, setDropdownDirection] = useState("down");

  const handleEditNameClick = () => {
    setGroupName(selectedChat.chatName);
    setEditName(true);
  };

  const handleNameUpdate = async () => {
    if (
      !selectedChat.isGroupChat ||
      groupName.trim() === selectedChat.chatName ||
      !groupName
    ) {
      return;
    }
    await updateGroupName({ chatId: selectedChat._id, chatName: groupName });
    setEditName(false);
  };

  const filteredUser = useMemo(() => {
    if (!search) {
      return [];
    }
    const selectedIds = selectedUsers.map((user) => user._id);
    return users.filter(
      (user) =>
        !selectedIds.includes(user._id) &&
        (user.fullName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, users, selectedUsers]);

  const handleRemoveClick = (removeUser) => {
    if (
      selectedChat.groupAdmin._id !== authUser._id &&
      removeUser._id !== authUser._id
    ) {
      return toast.error("Only admins are allowed");
    } else if (
      !selectedChat.users.some((user) => user._id === removeUser._id)
    ) {
      return toast.error("User must be added to group");
    }
    removeUserFromGroup({
      chatId: selectedChat._id,
      userId: removeUser._id,
    });
    if (removeUser._id !== authUser._id) {
      setSelectedUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === removeUser._id ? { ...user, disabled: true } : user
        )
      );
    }
  };

  const handleAddClick = (addUser) => {
    if (selectedChat.groupAdmin._id !== authUser._id) {
      return toast.error("Only admins are allowed");
    } else if (selectedChat.users.some((user) => user._id === addUser._id)) {
      return toast.error("User is already added to group");
    }
    addUserToGroup({
      chatId: selectedChat._id,
      userId: addUser._id,
    });
    setSelectedUsers([...selectedUsers, { ...addUser, disabled: true }]);
  };

  const dropdown =
    filteredUser.length > 0 &&
    createPortal(
      <div
        className={`absolute rounded-lg bg-base-100 shadow-md overflow-auto max-h-40 z-[9999] border border-gray-300`}
        style={{
          top:
            dropdownDirection === "up"
              ? inputRef.current?.getBoundingClientRect().top - 170
              : inputRef.current?.getBoundingClientRect().bottom + 6,
          left: inputRef.current?.getBoundingClientRect().left,
          width: inputRef.current?.offsetWidth,
        }}
      >
        {filteredUser.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              handleAddClick(user);
              setSearch("");
            }}
            className="flex items-center gap-3 w-full rounded-none p-3 border-b cursor-pointer border-base-300 hover:bg-base-300 list-row"
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
            </div>

            <div className="flex flex-col text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400 truncate">{user.email}</div>
            </div>
          </button>
        ))}
      </div>,
      document.body
    );

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    const rect = inputRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 160;

    if (spaceBelow < dropdownHeight) {
      setDropdownDirection("up");
    } else {
      setDropdownDirection("down");
    }
  }, [search, filteredUser]);

  useEffect(() => {
    if (!isModalOpen) {
      setSearch("");
      setEditName(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    setSelectedUsers(
      selectedChat.users.filter((user) => user._id !== authUser._id)
    );
  }, [selectedChat.users]);

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <UserPen className="w-4 h-4" />
            Group Name
          </div>
          <div className="relative">
            {editName ? (
              <>
                <input
                  type="text"
                  className={`px-4 py-2.5 w-full rounded-lg border`}
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-4">
                  <button
                    type="button"
                    className="h-fit p-1 rounded-sm btn btn-primary"
                    onClick={handleNameUpdate}
                    disabled={
                      groupName.trim() === selectedChat.chatName ||
                      !selectedChat.isGroupChat ||
                      !groupName ||
                      isGroupRenaming
                    }
                  >
                    {isGroupRenaming ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Check className="size-5 text-white" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="h-fit p-1 rounded-sm btn btn-primary"
                    onClick={(e) => setEditName(false)}
                  >
                    <X className="size-5 text-white" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {selectedChat.chatName}
                </p>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-4">
                  <button
                    type="button"
                    className="h-fit p-1 rounded-sm btn btn-primary"
                    onClick={handleEditNameClick}
                  >
                    <Pencil className="size-5 text-white" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            <UserRoundPlus className="w-4 h-4" />
            Users
          </div>
          <div className="flex flex-wrap gap-1 items-center">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className={`badge badge-primary max-w-32 w-fit ${
                  user?.disabled === true ? "opacity-50" : ""
                }`}
              >
                <span className="text-sm truncate">{user.fullName}</span>
                <button
                  className="rounded-full p-0.5 hover:bg-info-content"
                  onClick={() => handleRemoveClick(user)}
                  disabled={user?.disabled === true}
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="relative" ref={inputRef}>
            <input
              type="text"
              className={`px-4 py-2.5 w-full rounded-lg border`}
              value={search}
              placeholder="Select users"
              onChange={(e) => setSearch(e.target.value)}
            />
            {dropdown}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="btn btn-primary"
            onClick={() => handleRemoveClick(authUser)}
            disabled={isGroupUpdating}
          >
            {isGroupUpdating ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading
              </>
            ) : (
              "Leave Group"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditGroupModal;
