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
  MessageSquare,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { isSigningUp, signUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const response = validateForm();
    if (response === true) {
      signUp(formData);
    }
  };

  return (
    <div className="h-full grid lg:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-6">
          {/* LOGO */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
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
                  <Mail className="size-5 text-base-content/40" />
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
                  <Lock className="size-5 text-base-content/40" />
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
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="text-base-content/40" />
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
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
