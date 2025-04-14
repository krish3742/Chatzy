import { useState } from "react";
import toast from "react-hot-toast";
import { Camera, User, Mail, Pencil, X, Check, Loader2 } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const ProfilePage = () => {
  const { theme } = useThemeStore();
  const [editName, setEditName] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { authUser, isUpdatingProfile, updateProfile, isProfileRenaming } =
    useAuthStore();
  const [fullName, setFullName] = useState(authUser.fullName);

  const handleEditClick = () => {
    setFullName(authUser.fullName);
    setEditName(true);
  };

  const handleImageUpdate = async (e) => {
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
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImage(reader.result);
    };
    const formData = new FormData();
    formData.append("profilePic", file);
    await updateProfile(formData);
  };

  const handleNameUpdate = async (e) => {
    if (fullName === authUser.fullName || !fullName) {
      return;
    }
    await updateProfile({ fullName });
    setEditName(false);
  };

  return (
    <div className="h-full" data-theme={theme}>
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpdate}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="relative">
                {editName ? (
                  <>
                    <input
                      type="text"
                      className={`px-4 py-2.5 w-full rounded-lg border`}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-4">
                      <button
                        type="button"
                        className="h-fit p-1 rounded-sm btn btn-primary"
                        onClick={handleNameUpdate}
                        disabled={
                          fullName === authUser.fullName ||
                          !fullName ||
                          isProfileRenaming
                        }
                      >
                        {isProfileRenaming ? (
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
                      {authUser?.fullName}
                    </p>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-4">
                      <button
                        type="button"
                        className="h-fit p-1 rounded-sm btn btn-primary"
                        onClick={handleEditClick}
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
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="bg-base-300 rounded-xl p-6 pt-0">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
