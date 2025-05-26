import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const AppRoutes = ({ element, allowedRoles = [] }) => {
  const auth = useSelector((state) => state.auth.value); // Get the parsed user object from Redux

  // Block if no auth in Redux or cookie is missing
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Get the user role from Redux state (assuming user role is stored under auth.user.role)
  const userRole = auth?.user?.role;

  // Check if the role has permission for the route
  const isAllowed = allowedRoles.includes(userRole);

  // If allowed, render the element (route component), otherwise show 'Not Authorized'
  return isAllowed ? element : <Navigate to="/not-authorized" replace />;
};

export default AppRoutes;
