import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { Image, X, SendHorizontal } from "lucide-react";

import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const fileInputRef = useRef(null);
  const [text, setText] = useState("");
  const { sendMessage, selectedChat } = useChatStore();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should not exceed 2MB.");
      return;
    }
    const fileType = file.type;
    if (!fileType.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) {
      return;
    }

    const formData = new FormData();
    formData.append("chatId", selectedChat._id);
    formData.append("text", text.trim());
    formData.append("image", imageFile);
    sendMessage(formData);

    setText("");
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <textarea
            rows={1}
            className="w-full border border-gray-300 p-2 rounded-lg resize-none input-sm sm:input-md max-h-[100px]"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              const scrollHeight = Math.min(e.target.scrollHeight, 100);
              e.target.style.height = `${scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`btn btn-circle self-end ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-md self-end btn-circle flex items-center justify-center"
          disabled={!text.trim() && !imagePreview}
        >
          <SendHorizontal size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
