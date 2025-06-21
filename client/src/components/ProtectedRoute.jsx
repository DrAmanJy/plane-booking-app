import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { type, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!type) return <Navigate to="/auth?type=login" replace />;

  if (allowedRoles && !allowedRoles.includes(type)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
