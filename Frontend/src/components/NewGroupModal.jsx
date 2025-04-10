import { useRef, useState, useMemo, useEffect } from "react";
import { Loader2, Plus, UserPen, UserRoundPlus, X } from "lucide-react";

import { useChatStore } from "../store/useChatStore";

const NewGroupModal = () => {
  const modalRef = useRef(null);
  const [search, setSearch] = useState("");
  const [chatName, setChatName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { isCreatingGroup, users, createGroup } = useChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatName) {
      return toast.error("Chat name is required");
    } else if (selectedUsers.length < 1) {
      return toast.error("Users are required");
    }
    const response = await createGroup({
      name: chatName,
      users: JSON.stringify(selectedUsers.map((user) => user._id)),
    });
    if (response) {
      modalRef.current.checked = false;
      setIsModalOpen(false);
    }
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

  const handleRemoveClick = (data) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== data._id));
  };

  useEffect(() => {
    if (!isModalOpen) {
      setSearch("");
      setChatName("");
      setSelectedUsers([]);
    }
  }, [isModalOpen]);

  return (
    <>
      <label htmlFor="my_modal_7" onClick={() => setIsModalOpen(true)}>
        <div className="flex items-center gap-1 p-1.5 px-2 rounded-sm bg-base-300 cursor-pointer">
          <Plus className="size-6" />
          <span className="font-medium sm:hidden lg:inline">New Group</span>
        </div>
      </label>

      <input
        type="checkbox"
        id="my_modal_7"
        className="modal-toggle"
        ref={modalRef}
      />
      <div className="modal" role="dialog">
        <div className="modal-box overflow-visible">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-1"
            onClick={() => {
              modalRef.current.checked = false;
              setIsModalOpen(false);
            }}
          >
            ✕
          </button>
          <h3 className="text-xl lg:text-2xl text-center font-medium mb-4">
            Create Group Chat
          </h3>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Chat Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserPen className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 py-2 border border-gray-300 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-primary/50`}
                  placeholder="Group name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Users</span>
                </label>
                <div className="relative">
                  <div className="w-full p-2 px-2.5 border border-gray-300 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <div className="flex gap-2">
                      <div className="flex items-start pt-1">
                        <UserRoundPlus className="size-5 text-base-content" />
                      </div>

                      <div className="flex flex-wrap gap-1 flex-1 min-w-0 items-center">
                        {selectedUsers.map((user) => (
                          <div
                            key={user._id}
                            className="badge badge-primary max-w-32 w-fit"
                          >
                            <span className="text-sm truncate">
                              {user.fullName}
                            </span>
                            <button
                              className="rounded-full p-0.5 hover:bg-info-content"
                              onClick={() => handleRemoveClick(user)}
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        ))}
                        <input
                          type="text"
                          className="outline-none bg-transparent"
                          placeholder={
                            selectedUsers.length > 0 ? "" : "Select users"
                          }
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {filteredUser && filteredUser.length > 0 && (
                <ul className="absolute left-0 right-0 w-full bg-base-100 shadow-md overflow-auto h-fit max-h-40 z-10 rounded-b-md border border-t-0 border-gray-300">
                  {filteredUser.slice(0, 4).map((user) => (
                    <li
                      key={user._id}
                      onClick={() => {
                        setSelectedUsers([...selectedUsers, user]);
                        setSearch("");
                      }}
                      className="flex items-center gap-3 rounded-none p-3 border-b cursor-pointer border-base-300 hover:bg-base-300 list-row"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.profilePic || "/avatar.png"}
                          alt={user.name}
                          className="size-12 object-cover rounded-full"
                        />
                      </div>

                      <div className="flex flex-col text-left min-w-0">
                        <div className="font-medium truncate">
                          {user.fullName}
                        </div>
                        <div className="text-sm text-zinc-400 truncate">
                          {user.email}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-6" />
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={
                isCreatingGroup || !chatName.trim() || selectedUsers.length < 1
              }
            >
              {isCreatingGroup ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Group"
              )}
            </button>
          </form>
        </div>
        <label
          className="modal-backdrop"
          htmlFor="my_modal_7"
          onClick={() => setIsModalOpen(false)}
        >
          Close
        </label>
      </div>
    </>
  );
};

export default NewGroupModal;
