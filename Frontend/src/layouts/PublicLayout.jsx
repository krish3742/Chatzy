import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function PublicLayout({ children }) {
  const { authUser } = useAuthStore();

  if (authUser) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PublicLayout;
