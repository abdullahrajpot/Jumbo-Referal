import { useAuth } from "@app/_components/_core/AuthProvider/hooks";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

export default GuestRoute;