import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFF9F0" }}>
    <div className="flex flex-col items-center gap-3">
      <img src="/bhawishya-dwar/Mystical%20Zodiac%20Palm%20Wheel%20%20logo.png" alt="Loading" className="w-12 h-12 object-contain animate-pulse" />
      <div className="w-6 h-6 border-2 border-[#641A78] border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user || !["admin", "superadmin"].includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};
