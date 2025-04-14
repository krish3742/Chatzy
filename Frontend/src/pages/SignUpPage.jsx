import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Eye,
  User,
  Lock,
  Mail,
  EyeOff,
  Loader2,
  Camera,
  Image,
  X,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const formAPIData = new FormData();
  const { isSigningUp, signUp } = useAuthStore();
  const [profilePic, setProfilePic] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageHovered, setIsImageHovered] = useState(false);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return toast.error("Full name is required");
    } else if (!formData.email.trim()) {
      return toast.error("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Invalid email format");
    } else if (!formData.password) {
      return toast.error("Password is required");
    } else if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    } else {
      return true;
    }
  };

  const handleProfilePicUpdate = async (e) => {
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
      setProfilePic(file);
      setSelectedImage(reader.result);
      e.target.value = null;
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const response = validateForm();
    formAPIData.append("fullName", formData.fullName);
    formAPIData.append("email", formData.email);
    formAPIData.append("password", formData.password);
    if (profilePic) {
      formAPIData.append("profilePic", profilePic);
    }
    if (response === true) {
      signUp(formAPIData);
    }
  };

  return (
    <div className="h-full grid md:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-2">
        <div className="w-full max-w-md space-y-6">
          {/* LOGO */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content opacity-80">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="block md:hidden">
            <label className="label">
              <span className="label-text font-medium">Profile Picture</span>
            </label>
            <div className="flex justify-center">
              <div className="relative w-fit">
                <img
                  src={selectedImage || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicUpdate}
                    disabled={isSigningUp}
                  />
                </label>
                {selectedImage && (
                  <button
                    htmlFor="profile-remove"
                    className="absolute top-1 right-4 bg-base-content hover:scale-105 p-1 rounded-full"
                    onClick={() => {
                      setProfilePic(null);
                      setSelectedImage(null);
                    }}
                  >
                    <X className="w-3 h-3 text-base-200" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content opacity-70" />
                </div>
                <input
                  type="text"
                  className={`w-full pl-10 py-2 border border-gray-300 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-primary/50`}
                  placeholder="Kshitij Agrawal"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content opacity-70" />
                </div>
                <input
                  type="email"
                  className={`w-full pl-10 py-2 border border-gray-300 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-primary/50`}
                  placeholder="you@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content opacity-70" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 py-2 border border-gray-300 bg-transparent rounded focus:outline-none focus:ring-1 focus:ring-primary/50`}
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={(e) => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content opacity-70" />
                  ) : (
                    <Eye className="text-base-content opacity-70" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content opacity-85">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex flex-col gap-4 items-center justify-center bg-base-200">
        <div className="text-xl font-semibold flex items-center gap-2">
          Profile Picture
        </div>
        <div className="relative" onMouseLeave={() => setIsImageHovered(false)}>
          <img
            src={selectedImage || "/avatar.png"}
            alt="Profile"
            className="size-48 rounded-full object-cover border-4"
            onMouseEnter={() => setIsImageHovered(true)}
          />
          <label
            htmlFor="profile-upload"
            className="absolute bottom-2 right-2 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
          >
            <Camera className="w-5 h-5 text-base-200" />
            <input
              type="file"
              id="profile-upload"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePicUpdate}
              disabled={isSigningUp}
            />
          </label>
          {selectedImage && isImageHovered && (
            <button
              htmlFor="profile-remove"
              className="absolute top-3 right-7 bg-base-content hover:scale-105 p-1 rounded-full"
              onClick={() => {
                setProfilePic(null);
                setSelectedImage(null);
              }}
            >
              <X className="w-3 h-3 text-base-200" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
