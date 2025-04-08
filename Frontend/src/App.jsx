import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { theme } = useThemeStore();
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-9 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" data-theme={theme}>
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicLayout>
                <SignUpPage />
              </PublicLayout>
            }
          />
          <Route
            path="/"
            element={
              <PrivateLayout>
                <HomePage />
              </PrivateLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateLayout>
                <ProfilePage />
              </PrivateLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
