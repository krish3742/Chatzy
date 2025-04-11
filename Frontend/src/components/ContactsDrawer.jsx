import { Users, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import DrawerSkeleton from "./skeletons/DrawerSkeleton";

const ContactsDrawer = () => {
  const drawerRef = useRef(null);
  const { onlineUsers } = useAuthStore();
  const [search, setSearch] = useState("");
  const { getUsers, users, isUsersLoading, accessChat } = useChatStore();

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredUser = useMemo(() => {
    if (!search) {
      return users;
    }
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  const handleUserClick = useCallback(
    (id) => {
      accessChat(id);
      if (drawerRef.current) {
        drawerRef.current.checked = false;
      }
    },
    [accessChat]
  );

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className="drawer w-fit">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        ref={drawerRef}
      />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer"
          className="drawer-button tooltip tooltip-bottom flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-base-300"
          data-tip="Select user to chat"
        >
          <Users className="size-6" />
          <span className="hidden sm:inline font-medium">Contacts</span>
        </label>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="bg-base-200 text-base-content w-80 max-w-[100vw] h-screen flex flex-col overflow-y-auto overflow-x-hidden">
          <div className="sticky top-0 bg-base-200 z-10">
            <div className="border-b border-base-300 w-full p-4 sticky top-0 bg-base-200 z-10">
              <div className="flex items-center gap-2">
                <Users className="size-6" />
                <span className="font-medium">Contacts</span>
              </div>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-1"
                onClick={() => (drawerRef.current.checked = false)}
              >
                ✕
              </button>
            </div>
            <div className="m-2">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  className={`w-full p-2 border border-gray-300 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-primary/50`}
                  placeholder="Search user"
                  value={search}
                  onChange={handleSearchChange}
                />
                <button
                  type="button"
                  className="absolute right-0 mr-3 h-fit p-1 rounded-md hover:bg-base-300"
                >
                  <Search className="size-5 text-base-content/40" />
                </button>
              </div>
            </div>
          </div>

          {isUsersLoading ? (
            <DrawerSkeleton />
          ) : filteredUser && filteredUser.length === 0 ? (
            <div className="w-full text-center p-2">
              <span className="font-medium">No contacts</span>
            </div>
          ) : (
            <div className="flex-grow">
              {filteredUser.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.name}
                      className="size-12 object-cover rounded-full border-2"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                    )}
                  </div>

                  <div className="flex flex-col text-left min-w-0">
                    <div className="font-medium truncate">{user.fullName}</div>
                    <div className="text-sm text-zinc-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsDrawer;
