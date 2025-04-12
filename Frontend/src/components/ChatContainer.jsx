import ScrollableFeed from "react-scrollable-feed";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import TypingEffect from "../animations/TypingEffect";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const messageEndRef = useRef(null);
  const { authUser, socket } = useAuthStore();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState({});
  const { messages, getMessages, isMessagesLoading, selectedChat } =
    useChatStore();

  useEffect(() => {
    getMessages();
  }, [selectedChat, getMessages]);

  useEffect(() => {
    if (socket) {
      socket.on("typing", (typingUser) => {
        setIsTyping(true);
        setTypingUser(typingUser);
      });
      socket.on("stopTyping", () => {
        setIsTyping(false);
        setTypingUser({});
      });
    }
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatHeader />

      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (
        <ScrollableFeed>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
            {messages &&
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`chat ${
                    message.senderId._id === authUser._id
                      ? "chat-end"
                      : "chat-start"
                  }`}
                >
                  <div
                    className="tooltip chat-image avatar"
                    data-tip={message.senderId.fullName}
                  >
                    <div className="size-10 rounded-full border">
                      <img
                        src={message.senderId.profilePic || "/avatar.png"}
                        alt={message.senderId.fullName}
                      />
                    </div>
                  </div>

                  <div className="chat-header mb-0.5">
                    <time
                      className={`text-xs opacity-50 ${
                        message.senderId._id === authUser._id ? "mr-1" : "ml-1"
                      }`}
                    >
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                  <div className="chat-bubble flex flex-col">
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-[150px] sm:max-w-[200px] rounded-md"
                      />
                    )}
                    <span className="max-w-48 sm:max-w-72 lg:max-w-96  break-all">
                      {message.text && <p>{message.text}</p>}
                    </span>
                  </div>
                </div>
              ))}
            {isTyping && (
              <div className="chat chat-start cursor-default">
                <div
                  className="tooltip chat-image avatar"
                  data-tip={typingUser?.fullName}
                >
                  <div className="size-9 rounded-full border">
                    <img
                      src={typingUser?.profilePic || "/avatar.png"}
                      alt={typingUser?.fullName}
                    />
                  </div>
                </div>
                <div className="chat-bubble">
                  <TypingEffect />
                </div>
              </div>
            )}
            <div ref={messageEndRef}></div>
          </div>
        </ScrollableFeed>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
