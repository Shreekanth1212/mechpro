import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ userData, allowedRoles, children }) => {
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to={`/${userData.role}/dashboard`} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
