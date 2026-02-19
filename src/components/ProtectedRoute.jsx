import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // If user trying to access billing → go to billing login
    if (location.pathname.startsWith("/billing")) {
      return <Navigate to="/billing" replace />;
    }

    // Otherwise go to normal login
    return <Navigate to="/login" replace />;
  }

  return children;
}
