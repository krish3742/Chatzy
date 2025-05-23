import { Link } from "react-router-dom";
import { Bell, User, LogOut, ChevronDown, MessageSquare } from "lucide-react";

import { getUserName } from "../lib/utils";
import ContactsDrawer from "./ContactsDrawer";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const { theme, setTheme } = useThemeStore();
  const { logout, authUser } = useAuthStore();
  const { notifications, setSelectedChat, filterNotification } = useChatStore();

  const handleNotificationClick = (notification) => {
    setSelectedChat(notification.chat);
    filterNotification(notification);
  };

  return (
    <header className="border-b border-base-300 w-full sticky top-0 z-40 backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Contacts */}
        {authUser && <ContactsDrawer />}

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 transition-all">
            <div className="size-9 rounded-lg bg-base-300 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1
              className={`text-lg font-bold ${
                authUser ? "hidden sm:inline" : ""
              }`}
            >
              Chatzy
            </h1>
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          {/* Theme Icon */}
          <label className="swap swap-rotate">
            <input
              type="checkbox"
              className="theme-controller"
              value={theme}
              onChange={() => setTheme()}
            />

            <svg
              className="swap-on h-7 w-7 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>

            <svg
              className="swap-off h-7 w-7 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
          </label>

          {authUser && (
            <div className="flex items-center gap-3">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="tooltip tooltip-bottom relative cursor-pointer flex items-center hover:bg-base-300 p-2 rounded-full"
                  data-tip="Notifications"
                >
                  <Bell className="size-6" />
                  {notifications.length > 0 && (
                    <span
                      className="bg-info"
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        color: "black",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        fontSize: "12px",
                      }}
                    >
                      {notifications.length}
                    </span>
                  )}
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content bg-base-100 rounded-box z-1 w-40 sm:w-60 p-2 shadow-sm border-base-content border"
                >
                  {notifications && notifications.length === 0 ? (
                    <li className="rounded-sm p-1 w-full py-1.5">
                      <span>No new message</span>
                    </li>
                  ) : (
                    notifications.map((notification) => (
                      <li
                        key={notification._id}
                        className="hover:bg-base-300 rounded-sm p-1 w-full py-1.5 cursor-pointer truncate"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {notification.chat.isGroupChat
                          ? `New message in ${notification.chat.chatName}`
                          : `New message from ${getUserName(
                              notification.chat.users,
                              authUser
                            )}`}
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* {Profile Icon} */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="hover:bg-base-300 flex px-1.5 py-1 items-center gap-1 rounded-sm"
                >
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt={authUser.fullName}
                    className="size-8 object-cover rounded-full border-base-content border"
                  />
                  <ChevronDown className="size-5" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content bg-base-100 rounded-box z-1 w-40 sm:w-52 p-2 shadow-sm border-base-content border"
                >
                  <li>
                    <Link
                      to={"/profile"}
                      className={`flex gap-2 items-center hover:bg-base-300 rounded-sm p-1  w-full py-1.5`}
                    >
                      <User className="size-5" />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      className="flex gap-2 items-center hover:bg-base-300 rounded-md p-1 w-full py-1.5"
                      onClick={logout}
                    >
                      <LogOut className="size-5" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
