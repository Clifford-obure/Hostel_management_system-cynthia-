import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const ProtectedRoute = ({ roles = [], redirectPath = "/login" }) => {
  const { isAuthenticated, user } = useAuth();
  console.log("User Role:", user);
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // If role is not allowed, redirect to appropriate dashboard
    const dashboardPath =
      user.role === "matron" ? "/matron/dashboard" : "/tenant/dashboard";
    return <Navigate to={dashboardPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
