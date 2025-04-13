import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Eye, Mail, Lock, EyeOff, Loader2 } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isLoggingIn, loggingAsGuest, login } = useAuthStore();

  const validateForm = () => {
    if (!formData.email.trim()) {
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

  const handleSubmit = async (e, role = "user") => {
    e.preventDefault();
    if (role === "user") {
      const response = validateForm();
      if (response === true) {
        login(formData);
      }
    } else {
      login({ email: "guest@example.com", password: "password" });
    }
  };

  return (
    <div className="h-full grid md:grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-2">
        <div className="w-full max-w-md space-y-4">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content opacity-80">
                Sign in to your account
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-base-content opacity-70" />
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
              disabled={isLoggingIn || loggingAsGuest}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <button
            type="submit"
            className="btn btn-error w-full"
            onClick={(e) => handleSubmit(e, "guest")}
            disabled={loggingAsGuest || isLoggingIn}
          >
            {loggingAsGuest ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Login as Guest User"
            )}
          </button>
          <div className="text-center">
            <p className="text-base-content opacity-85">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
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

export default LoginPage;
