import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
  const { selectedChat } = useChatStore();
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div
        className={`sm:w-40 md:w-56 lg:w-72 ${
          selectedChat ? "hidden sm:block" : "w-screen"
        }`}
      >
        <Sidebar />
      </div>
      <div
        className={`flex-1 h-full overflow-hidden items-center justify-center sm:flex ${
          selectedChat ? "" : "hidden"
        }`}
      >
        <NoChatSelected />
      </div>
    </div>
  );
};

export default HomePage;
