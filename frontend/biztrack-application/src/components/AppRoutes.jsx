// src/components/AuthWrapper.jsx (Renamed for clarity, was AppRoutes.jsx)
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AppRoutes = ({ children, allowedRoles = [] }) => {
  const user = useSelector((state) => state.auth.value); // Get the user object from Redux

  // IMPORTANT: This component assumes that 'user' is already properly loaded from the cookie
  // and set in Redux by a parent component (like ThemedMainLayout or an App-level useEffect).
  // If user is null here, it means the *parent* failed to authenticate, or this route isn't meant to be protected.

  // If no user object in Redux (meaning not authenticated), redirect to login
  // This is a safety net; the primary authentication check should be higher up.
  if (!user) {
    // console.log("AuthWrapper: No user in Redux, redirecting to login."); // Debug
    return <Navigate to="/" replace />; // Assuming '/' is your login path
  }

  // Ensure user.role exists and is a string
  const userRole = user?.role;
  if (!userRole) {
    console.error("AuthWrapper: User object missing role:", user);
    return <Navigate to="/" replace />; // Or to an error page
  }

  // Check if the user's role is allowed for this specific route
  // If allowedRoles is empty, it means any authenticated user can access it (still good practice to list all relevant roles)
  const isAllowed = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  // If allowed, render the children (the actual route component)
  // Otherwise, navigate to unauthorized page
  return isAllowed ? children : <Navigate to="/unauthorized" replace />;
};

export default AppRoutes;