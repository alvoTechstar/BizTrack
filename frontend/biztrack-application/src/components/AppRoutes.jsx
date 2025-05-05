import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const AppRoutes = ({ children }) => {
  const auth = useSelector((state) => state.auth.value);  // Get the parsed user object from Redux
  
  // Block if no auth in Redux (or cookie is missing)
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Get user role from the Redux state (which is already parsed)
  const userRole = auth?.user?.role;

  // Check if the role has permission for the route
  const isAllowed = children?.permissions?.includes(userRole);

  return isAllowed ? children.element : <Navigate to="/not-authorized" replace />;
};

export default AppRoutes;
